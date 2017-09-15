// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { isFunction } from '../../common/utils';

import './pcsGrid.css';

const ROW_HEIGHT = 48;

/**
 * PcsGrid is a helper wrapper around AgGrid. The primary functionality of this wrapper
 * is to allow easy reuse of the pcs dark grid theme. To see params, read the AgGrid docs.
 *
 * Props:
 *  getSoftSelectId: A method that when provided with the a row data object returns an id for that object
 *  softSelectId: The ID of the row data to be soft selected
 *  onHardSelectChange: Fires when rows are hard selected
 *  onSoftSelectChange: Fires when a row is soft selected
 * TODO (stpryor): Add design pagination
 */
export class PcsGrid extends Component {

  constructor(props) {
    super(props);
    this.state = { currentSoftSelectId: '' };
  }

  /** When new props are passed in, check if the soft select state needs to be updated */
  componentWillReceiveProps(nextProps) {
    if (this.currentSoftSelectId !== nextProps.softSelectId) {
      this.setState({ currentSoftSelectId: nextProps.softSelectId }, this.refreshRows);
    }
  }

  /** Save the gridApi locally on load */
  onGridReady = gridReadyEvent => {
    this.gridApi = gridReadyEvent.api;
    if (isFunction(this.props.onGridReady)) {
      this.props.onGridReady(gridReadyEvent);
    }
  }

  /** Refreshes the grid to update soft select CSS states */
  refreshRows = () => {
    if (this.gridApi.rowRenderer && this.gridApi.rowRenderer.refreshRows) {
      this.gridApi.rowRenderer.refreshRows(this.gridApi.getRenderedNodes());
    }
  };

  /** Computes the CSS classes to apply to each row, including soft select */
  getRowClass = params => {
    let rowClasses = '';
    if (isFunction(this.props.getSoftSelectId)) {
      console.log('Calling getSoftSelectId');
      rowClasses = this.props.getSoftSelectId(params.data) === this.props.softSelectId ? 'pcs-row-soft-selected' : '';
    }
    if (isFunction(this.props.getRowClass)) {
      rowClasses += ` ${this.props.getRowClass(params)}`;
    }
    return rowClasses;
  }

  /** When a row is hard selected, try to fire a hard select event, plus any props callbacks */
  onSelectionChanged = () => {
    const { onHardSelectChange, onSelectionChanged } = this.props;
    if (isFunction(onHardSelectChange)) {
      onHardSelectChange(this.gridApi.getSelectedRows());
    }
    if (isFunction(onSelectionChanged)) {
      onSelectionChanged();
    }
  };

  /** When a row is selected, try to fire a soft select event, plus any props callbacks */
  onRowClicked = row => {
    const { onSoftSelectChange, onRowClicked } = this.props;
    if (isFunction(onSoftSelectChange)) {
      onSoftSelectChange(row.data, row);
    }
    if (isFunction(onRowClicked)) {
      onRowClicked(row);
    }
  };

  render() {
    const gridParams = {
      ...this.props,
      headerHeight: ROW_HEIGHT,
      rowHeight: ROW_HEIGHT,
      getRowClass: this.getRowClass,
      onGridReady: this.onGridReady,
      onSelectionChanged: this.onSelectionChanged,
      onRowClicked: this.onRowClicked
    };
    return (
      <div className="pcs-grid-container ag-dark pcs-ag-dark">
        <AgGridReact {...gridParams} />
      </div>
    );
  }
}

export default PcsGrid;
