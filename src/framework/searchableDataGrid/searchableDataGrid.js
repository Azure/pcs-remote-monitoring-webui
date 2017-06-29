// Copyright (c) Microsoft. All rights reserved

import React, {Component} from "react";
import ReactDataGrid from "react-data-grid";
import EventTopic from "../../common/eventtopic.js";
import {debounce, isFunction} from "../../common/utils.js";
import Config from "../../common/config";
import httpClient from "../../common/httpClient";

import "./searchableDataGrid.css";

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
            clientHeight: 300,
        };
        this.container = null;
        this.tokens = [];
    }

    setProps(props) {
        this.props = Object.assign({}, this.props, props);
    }

    setDatasource(datasource) {
        this.setState({datasource: datasource}, () => {
            this.getData()
        });

    }

    setMultiSelect(multiSelect) {
        this.setState({multiSelect: multiSelect}, () => {
            this.render();
        });
    }

    setColumns(columns) {
        var cols = [];
        for (var key in columns) {
            let nameTokenIdx = columns[key].indexOf(':');
            var colDisplayName, colName;
            if (nameTokenIdx > 0) {
                colDisplayName = columns[key].slice(0, nameTokenIdx).trim();
                colName = columns[key].slice(nameTokenIdx + 1, columns[key].length).trim();
            }
            else {
                colDisplayName = columns[key].trim().slice(columns[key].lastIndexOf('.') + 1, columns[key].length);
                colName = columns[key].trim()
            }
            cols.push({key: colName, name: colDisplayName, sortable: true, resizable: true});
        }
        this.setState({columns: cols});
    }

    setTitle(title) {
        this.setState({title: title});
    }

    resize() {
        if (this.container) {
            let newClientHeight = this.props.height || this.container.parentElement.clientHeight || undefined;
            if (newClientHeight && this.state.title.length) {
                newClientHeight -= 45;
            }
            if (newClientHeight && this.props.showLastUpdate) {
                newClientHeight -= 35
            }
            if (newClientHeight && this.props.enableSearch) {
                newClientHeight -= 30
            }
            if (newClientHeight && this.props.filters) {
                newClientHeight -= 55
            }
            this.setState({clientWidth: this.props.width || undefined});
            this.setState({clientHeight: newClientHeight});
        }
    }

    getValueForKey(key, value) {
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

    componentDidMount() {
        if (this.props.topics) {
            for (let interestingTopic of this.props.topics) {
                this.tokens.push(EventTopic.subscribe(interestingTopic, (topic, data, publisher) => {
                    this.onEvent(topic, this.getValueForKey(this.props.eventDataKey, data), publisher);
                }));
            }
        }

        this.filterRows = debounce(this.filterRows, 1000);

        if(this.props.autoLoad){
            this.getData(this.props.initFilter);
        }
        this.setColumns(this.props.columns.split(','));
        this.resize();
    }

    filterRows(event) {
        var filterdRows = this.state.originalRows.filter((row) => {
            for (let key in row) {
                if (row[key].toString().toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0) {
                    return true
                }
            }
            return false;
        });
        this.setState({rows: filterdRows});
    }

    onEvent(topic, data, publisher) {
        this.setState({currentFilter: data}, () => {
            this.getData(data[0]);
        });
    }

    refreshData() {
        this.getData(this.state.currentFilter);
    }

    componentWillUnmount() {
        this.tokens.forEach((token) => EventTopic.unsubscribe(token));
    }

    rowGetter(i) {
        return this.state.rows[i];
    }

    handleGridSort(sortColumn, sortDirection) {
        const comparer = (a, b) => {
            if (sortDirection === 'ASC') {
                return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
            } else if (sortDirection === 'DESC') {
                return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
            }
        };

        const rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.state.rows.sort(comparer);

        this.setState({rows});
    }

    getData(filter) {
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

            this.dataReq = httpClient.get(Config.solutionApiUrl + '/' + normalizedUrl)
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
    }

    onRowsSelected(rows) {
        this.setState({selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx))}, function () {
            const itemIds = this.state.selectedIndexes.map((i) => {
                let idcol = this.props.idCol || Object.keys(this.state.rows[i])[0];
                return this.state.rows[i][idcol];
            });
            EventTopic.publish(this.props.rowsSelectEvent || 'system.grid.itemsSelected.grid_' + this.props.idCol, itemIds, this);
        });

    }

    onRowsDeselected(rows) {
        let rowIndexes = rows.map(r => r.rowIdx);
        this.setState({selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1)}, () => {
            const itemIds = this.state.selectedIndexes.map((i) => {
                let idcol = this.props.idCol || Object.keys(this.state.rows[i])[0];
                return this.state.rows[i][idcol];
            });
            EventTopic.publish(this.props.rowsSelectEvent || 'system.grid.itemsSelected.grid_' + this.props.idCol, itemIds, this);
        });

    }

    onRowClick(rowIdx, row) {
        let rows = this.state.rows;
        this.setState({rows}, () => {
            if (row) {
                EventTopic.publish(this.props.rowClickEvent || 'system.grid.itemSelected.grid_' + this.props.idCol, row, this);
            }
        });
    }

    render() {
        const {Row} = ReactDataGrid;
        class RowRenderer extends Component{

            setScrollLeft(scrollBy) {
                this.row.setScrollLeft(scrollBy);
            }

            getRowStyle() {
                return {
                    backgroundColor: this.getRowBackground()
                };
            }

            getRowBackground() {
                return this.props.idx % 2 ? 'gray' : 'white';
            }

            render() {
                return (<div style={this.getRowStyle()}><Row ref={ node => this.row = node } {...this.props} /></div>);
            }
        };

        let title = null;
        if (this.state.title && this.state.title.length) {
            title = <p style={{fontSize: "24px"}}>{this.state.title}</p>
        }

        let searchBox = null;
        if (this.props.enableSearch) {
            searchBox = <div className="input-group col-sm-4">
                <input type="text" style={{maxWidth: '800px'}} className="form-control" aria-describedby="open-filter"
                       placeholder="filter rows" onChange={this.filterRows.bind(this)}/>
                <span className="input-group-addon" id="open_filter">
                    <span className="glyphicon glyphicon-th" aria-hidden="true"/>
                </span>
            </div>
        }

        const dataGrid = (
            <ReactDataGrid ref={grid => this.datagridObj = grid}
                           onGridSort={this.handleGridSort.bind(this)}
                           columns={this.state.columns}
                           rowGetter={this.rowGetter.bind(this)}
                           onRowClick={this.onRowClick.bind(this)}
                           rowSelection={
                               this.state.multiSelect ? {
                                   showCheckbox: this.state.multiSelect,
                                   enableShiftSelect: this.state.multiSelect,
                                   onRowsSelected: this.onRowsSelected.bind(this),
                                   onRowsDeselected: this.onRowsDeselected.bind(this),
                                   selectBy: {
                                       indexes: this.state.selectedIndexes
                                   }
                               } : null
                           }
                           enableCellSelect={false}
                           enableRowSelect={this.state.multiSelect}
                           rowsCount={this.state.rows.length}
                           rowRenderer={RowRenderer}
                           minHeight={this.state.clientHeight}
                           minWidth={this.state.clientWidth}/>
        );

        return (
            <div ref={(input) => {
                this.container = input;
            }}
                 className="datagrid-container">
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
                    (<a href="#/refresh" onClick={this.refreshData.bind(this)}>
                        Last update on {this.state.lastupdate.toLocaleString()} &nbsp;&nbsp;
                        <span className="glyphicon glyphicon-refresh"/>
                    </a>)
                    : (<a href="#/refresh" onClick={this.refreshData.bind(this)}>
                        Click to refresh &nbsp;&nbsp;
                        <span className="glyphicon glyphicon-refresh"/>
                    </a>))}
            </div>

        );
    }
}

export default SearchableDataGrid;