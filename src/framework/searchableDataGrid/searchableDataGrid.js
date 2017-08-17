// Copyright (c) Microsoft. All rights reserved

import React, { Component } from 'react';
import EventTopic from '../../common/eventtopic.js';
import { debounce, isFunction } from '../../common/utils.js';
import httpClient from '../../common/httpClient';
import { AgGridReact } from 'ag-grid-react';

import './searchableDataGrid.css';
import '../../../node_modules/ag-grid/dist/styles/ag-grid.css';
import '../../../node_modules/ag-grid/dist/styles/theme-dark.css';

class SearchableDataGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.title || '',
      datasource: this.props.datasource || '/api/v1/events/',
      dataFormatter: this.props.dataFormatter || undefined,
      columns: [],
      rows: [],
      originalRows: [],
      selectedIndexes: [],
      multiSelect: this.props.multiSelect || false,
      currentFilter: '',
      loading: false
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

  static hookWindowResize() {
    (function() {
      let isRunning = false;
      window.addEventListener('resize', function() {
        if (isRunning) {
          return;
        }
        isRunning = true;
        requestAnimationFrame(function() {
          window.dispatchEvent(new CustomEvent('layoutResize'));
          isRunning = false;
        });
      });
    })();
  }

  componentWillReceiveProps(nextProps) {
    this.resize(nextProps);
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    if (isFunction(this.props.onGridReady)) {
      this.props.onGridReady.call(this, params);
    }

    this.gridApi.sizeColumnsToFit();
  };

  resize = props => {
    if (this.container) {
      /* 
        TODO (stpryor): If props change, render will be called again. 
        If the height is not provided, the parentElement height will be used.
        This causes the height to grow with each props change for now reason.
      */
      let newClientHeight =
        props.height || this.container.parentElement.clientHeight || undefined;
      if (newClientHeight && this.state.title.length) {
        newClientHeight -= 45;
      }
      if (newClientHeight && props.showLastUpdate) {
        newClientHeight -= 35;
      }
      if (newClientHeight && props.enableSearch) {
        newClientHeight -= 30;
      }
      if (newClientHeight && props.filters) {
        newClientHeight -= 55;
      }
      this.setState({ clientWidth: props.width || undefined });
      this.setState({ clientHeight: newClientHeight });
    }
  };

  componentDidMount() {
    if (this.props.topics) {
      for (let interestingTopic of this.props.topics) {
        this.tokens.push(
          EventTopic.subscribe(interestingTopic, (topic, data, publisher) => {
            this.onEvent(
              topic,
              SearchableDataGrid.getValueForKey(this.props.eventDataKey, data),
              publisher
            );
          })
        );
      }
    }

    this.filterRows = debounce(this.filterRows, 1000);

    if (this.props.autoLoad) {
      this.getData(this.props.initFilter);
    }
    if (this.props.multiSelect) {
      this.props.columnDefs.unshift({
        headerName: '',
        field: '',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        pinned: 'left',
        width: 50
      });
    }

    SearchableDataGrid.hookWindowResize();
    window.addEventListener('layoutResize', () => this.resize(this.props));
    this.resize(this.props);
  }

  selectAll() {
    this.gridApi.selectAll();
  }

  filterRows = event => {
    let filterdRows = this.state.originalRows.filter(row => {
      return this.contains(row, event.target.value.toString().toLowerCase());
    });
    this.setState({ rows: filterdRows });
  };

  contains (obj, value) {
    return Object.keys(obj).some(key => {
      const p = obj[key];
      if(typeof p === "object") {
        return this.contains(p, value);
      }
      else {
        return p != null && p.toString().toLowerCase().indexOf(value) >= 0;
      }
    });
  }

  onEvent = (topic, data) => {
    this.setState({ currentFilter: data }, () => {
      this.getData(data);
    });
  };

  refreshData = () => {
    this.getData(this.state.currentFilter);
  };

  componentWillUnmount() {
    EventTopic.unsubscribe(this.tokens);
  }

  getData = filter => {
    this.setState({ loading: true });
    if (isFunction(this.props.getData)) {
      this.props.getData(filter, data => {
        this.setState({
            originalRows: data,
            rows: data,
            lastupdate: new Date(),
            loading: false
          });
      });
    }
    else if (this.state.datasource && this.state.datasource.length) {
      let normalizedUrl;

      if (isFunction(this.state.datasource)) {
        normalizedUrl = this.state.datasource.apply(this, [filter]);
      } else {
        const match = this.props.urlSearchPattern
          ? this.props.urlSearchPattern.match(new RegExp('^/(.*?)/([gimy]*)$'))
          : null;

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

      httpClient
        .get(normalizedUrl)
        .then(data => {
          let formattedData = this.state.dataFormatter ? this.state.dataFormatter(data) : data;
          this.setState({
            originalRows: formattedData,
            rows: formattedData,
            lastupdate: new Date()
          });
          const itemIds = formattedData.map(item => {
            let idcol = this.props.idCol || Object.keys(item)[0];
            return item[idcol];
          });
          EventTopic.publish(
            this.props.rowsSelectEvent ||
              'system.grid.itemsSelected.grid_' + this.props.idCol,
            itemIds,
            this
          );
          this.setState({
            selectedIndexes: Object.keys(formattedData).map(key => parseInt(key, 10)),
            loading: false
          });
        })
        .catch(err => {
          console.error('failed to load data from server', err);
        });
    }
  };

  onRowSelectionChanged = event => {
    const rows = this.gridApi.getSelectedRows();

    if (this.props.rowClickEvent) {
      EventTopic.publish(this.props.rowClickEvent, rows, this);
    }

    if (isFunction(this.props.onRowSelectionChanged)) {
      this.props.onRowSelectionChanged(rows);
    }
  };

  onRowClicked = event => {
    if (isFunction(this.props.onRowClicked)) {
      this.props.onRowClicked(event.data);
    }
  };

  render() {
    let title = null;
    if (this.state.title && this.state.title.length) {
      title = (
        <p style={{ fontSize: '24px' }}>
          {this.state.title}
        </p>
      );
    }

    let searchBox = null;
    if (this.props.enableSearch) {
      searchBox = (
        <div className="input-group col-sm-4">
          <input
            type="text"
            style={{ maxWidth: '800px' }}
            className="form-control"
            aria-describedby="open-filter"
            placeholder="filter rows"
            onChange={this.filterRows}
          />
          <span className="input-group-addon" id="open_filter">
            <span className="glyphicon glyphicon-th" aria-hidden="true" />
          </span>
        </div>
      );
    }

    let containerStyle = {
      height: this.state.clientHeight,
      width: this.state.clientWidth
    };

    const dataGrid = (
      <div style={containerStyle} className="ag-dark">
        <AgGridReact
          {...this.props}
          // properties
          enableColResize={true}
          rowData={this.props.rowData || this.state.rows}
          paginationAutoPageSize={true}
          pagination={
            typeof this.props.pagination === 'undefined'
              ? true
              : this.props.pagination
          }
          // events
          onGridReady={this.onGridReady}
          rowSelection={this.props.multiSelect ? 'multiple' : 'single'}
          suppressRowClickSelection={!!this.props.multiSelect}
          onSelectionChanged={this.onRowSelectionChanged}
          onRowClicked={this.onRowClicked}
        />
      </div>
    );

    return (
      <div
        ref={input => {
          this.container = input;
        }}
        className="datagrid-container"
      >
        {title}
        {!this.state.loading
          ? <div>
              {searchBox}
              <div className="datagrid-body">
                {dataGrid}
              </div>
            </div>
          : <div className="loader">loading</div>}
        {this.props.showLastUpdate &&
          (this.state.lastupdate
            ? <a href="#/refresh" onClick={this.refreshData}>
                Last update on {this.state.lastupdate.toLocaleString()}{' '}
                &nbsp;&nbsp;
                <span className="glyphicon glyphicon-refresh" />
              </a>
            : <a href="#/refresh" onClick={this.refreshData}>
                Click to refresh &nbsp;&nbsp;
                <span className="glyphicon glyphicon-refresh" />
              </a>)}
      </div>
    );
  }
}

export default SearchableDataGrid;
