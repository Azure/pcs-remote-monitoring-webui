// Copyright (c) Microsoft. All rights reserved

import React, {Component} from "react";
import EventTopic from "../../common/eventtopic.js";
import {debounce, isFunction} from "../../common/utils.js";
import httpClient from "../../common/httpClient";
import {AgGridReact} from "ag-grid-react";

import "./searchableDataGrid.css";
import "../../../node_modules/ag-grid/dist/styles/ag-grid.css";
import "../../../node_modules/ag-grid/dist/styles/theme-fresh.css";

class SearchableDataGrid extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: this.props.title || "",
            datasource: this.props.datasource || "/api/v1/events/",
            columns: [],
            rows: [],
            originalRows: [],
            selectedIndexes: [],
            multiSelect: this.props.multiSelect || false,
            currentFilter: "",
        };
        this.container = null;
        this.tokens = [];
    }

    static getValueForKey(key, value) {
        if (typeof value === 'string') return value;

        let keyTokens = key ? key.split('.') : key;
        let retval = Object.assign({}, value);
        for (let keyToken of keyTokens) {
            if (keyToken && retval[keyToken]) {
                retval = retval[keyToken];
            }
        }
        return retval;
    }

    componentWillReceiveProps(nextProps) {
        this.resize(nextProps);
    }

    onGridReady = (params) => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        if (isFunction(this.props.onGridReady)) {
            this.props.onGridReady.call(this, params)
        }

        this.gridApi.sizeColumnsToFit();
    };

    resize = (props) => {
        if (this.container) {
            let newClientHeight = props.height || this.container.parentElement.clientHeight || undefined;
            if (newClientHeight && this.state.title.length) {
                newClientHeight -= 45;
            }
            if (newClientHeight && props.showLastUpdate) {
                newClientHeight -= 35
            }
            if (newClientHeight && props.enableSearch) {
                newClientHeight -= 30
            }
            if (newClientHeight && props.filters) {
                newClientHeight -= 55
            }
            if (newClientHeight && props.pagination) {
                newClientHeight -= 30
            }
            this.setState({clientWidth: props.width || undefined});
            this.setState({clientHeight: newClientHeight});
        }
    };

    componentDidMount() {
        if (this.props.topics) {
            for (let interestingTopic of this.props.topics) {
                this.tokens.push(EventTopic.subscribe(interestingTopic, (topic, data, publisher) => {
                    this.onEvent(topic, SearchableDataGrid.getValueForKey(this.props.eventDataKey, data), publisher);
                }));
            }
        }

        this.filterRows = debounce(this.filterRows, 1000);

        if (this.props.autoLoad) {
            this.getData(this.props.initFilter);
        }
        this.resize(this.props);
    }

    filterRows = (event) => {
        let filterdRows = this.state.originalRows.filter((row) => {
            for (let key of row) {
                if (key.toString().toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0) {
                    return true
                }
            }
            return false;
        });
        this.setState({rows: filterdRows});
    };

    onEvent = (topic, data) => {
        this.setState({currentFilter: data}, () => {
            this.getData(data);
        });
    };

    refreshData = () => {
        this.getData(this.state.currentFilter);
    };

    componentWillUnmount() {
        EventTopic.unsubscribe(this.tokens);
    }

    rowGetter = (i) => {
        return this.state.rows[i];
    };

    handleGridSort = (sortColumn, sortDirection) => {
        const comparer = (a, b) => {
            if (sortDirection === 'ASC') {
                return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
            } else if (sortDirection === 'DESC') {
                return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
            }
        };

        const rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.state.rows.sort(comparer);

        this.setState({rows});
    };

    getData = (filter) => {
        if (this.state.datasource && this.state.datasource.length) {

            let normalizedUrl;

            if (isFunction(this.state.datasource)) {
                normalizedUrl = this.state.datasource.apply(this, [filter]);
            } else {
                const match = this.props.urlSearchPattern ? this.props.urlSearchPattern.match(new RegExp('^/(.*?)/([gimy]*)$')) : null;

                // Avoid unexpected query string.
                if (filter && match && typeof filter === 'string') {
                    let regex = new RegExp(match[1], match[2]);
                    normalizedUrl = this.state.datasource.replace(regex, filter);
                } else if (match && !(filter && typeof filter === 'string')) {
                    return;
                } else {
                    normalizedUrl = this.state.datasource;
                }
            }

            httpClient.get(normalizedUrl)
                .then((data) => {
                    this.setState({originalRows: data, rows: data, lastupdate: new Date()});
                    const itemIds = data.map(item => {
                        let idcol = this.props.idCol || Object.keys(item)[0];
                        return item[idcol];
                    });
                    EventTopic.publish(this.props.rowsSelectEvent || 'system.grid.itemsSelected.grid_' + this.props.idCol, itemIds, this);
                    this.setState({selectedIndexes: Object.keys(data).map(key => parseInt(key, 10))});
                })
                .catch((err) => {
                    console.error('failed to load data from server', err);
                });
        }
    };

    onRowsSelected = (rows) => {
        this.setState({selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx))}, function () {
            const itemIds = this.state.selectedIndexes.map((i) => {
                let idcol = this.props.idCol || Object.keys(this.state.rows[i])[0];
                return this.state.rows[i][idcol];
            });
            EventTopic.publish(this.props.rowsSelectEvent || 'system.grid.itemsSelected.grid_' + this.props.idCol, itemIds, this);
        });

    };

    onRowsDeselected = (rows) => {
        let rowIndexes = rows.map(r => r.rowIdx);
        this.setState({selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1)}, () => {
            const itemIds = this.state.selectedIndexes.map((i) => {
                let idcol = this.props.idCol || Object.keys(this.state.rows[i])[0];
                return this.state.rows[i][idcol];
            });
            EventTopic.publish(this.props.rowsSelectEvent || 'system.grid.itemsSelected.grid_' + this.props.idCol, itemIds, this);
        });

    };

    onRowClick = (rowIdx, row) => {
        let rows = this.state.rows;
        this.setState({rows}, () => {
            if (row) {
                EventTopic.publish(this.props.rowClickEvent || 'system.grid.itemSelected.grid_' + this.props.idCol, row, this);
            }
        });
    };

    render() {
        let title = null;
        if (this.state.title && this.state.title.length) {
            title = <p style={{fontSize: "24px"}}>{this.state.title}</p>
        }

        let searchBox = null;
        if (this.props.enableSearch) {
            searchBox =
                <div className="input-group col-sm-4">
                    <input type="text" style={{maxWidth: '800px'}} className="form-control"
                           aria-describedby="open-filter"
                           placeholder="filter rows" onChange={this.filterRows}/>
                    <span className="input-group-addon" id="open_filter">
                        <span className="glyphicon glyphicon-th" aria-hidden="true"/>
                    </span>
                </div>;
        }

        let containerStyle = {
            height: this.state.clientHeight,
            width: this.state.clientWidth
        };
        const dataGrid = (
            <div style={containerStyle} className="ag-fresh">
                <AgGridReact
                    {...this.props}
                    // properties
                    rowData={ this.props.rowData || this.state.rows}
                    paginationAutoPageSize={true}
                    pagination={true}
                    // events
                    onGridReady={this.onGridReady}

                    onGridSort={this.handleGridSort}
                    columns={this.state.columns}
                    rowGetter={this.rowGetter}
                    onRowClick={this.onRowClick}
                    enableCellSelect={false}
                    enableRowSelect={this.state.multiSelect}
                    rowsCount={this.state.rows.length}
                    minHeight={this.state.clientHeight}
                    minWidth={this.state.clientWidth}>
                </AgGridReact>
            </div>
        );

        return (
            <div ref={(input) => {
                this.container = input;
            }} className="datagrid-container">
                {title}
                {this.state.originalRows.length > 0 ? (
                    <div>
                        {searchBox}
                        <div className="datagrid-body">{dataGrid}</div>
                    </div>
                ) : (
                    <div className="datagrid-body">No data yet</div>
                )}
                {this.props.showLastUpdate && (this.state.lastupdate ?
                    (
                        <a href="#/refresh" onClick={this.refreshData}>
                            Last update on {this.state.lastupdate.toLocaleString()} &nbsp;&nbsp;
                            <span className="glyphicon glyphicon-refresh"/>
                        </a>
                    ) : (
                        <a href="#/refresh" onClick={this.refreshData}>
                            Click to refresh &nbsp;&nbsp;
                            <span className="glyphicon glyphicon-refresh"/>
                        </a>
                    ))}
            </div>

        );
    }
}

export default SearchableDataGrid