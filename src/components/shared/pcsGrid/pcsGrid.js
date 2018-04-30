// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Rx from 'rxjs';
import Config from 'app.config';
import { isFunc } from 'utilities';
import { Indicator } from '../indicator/indicator';

import '../../../../node_modules/ag-grid/dist/styles/ag-grid.css';
import '../../../../node_modules/ag-grid/dist/styles/ag-theme-dark.css';
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
    this.state = {
      currentSoftSelectId: undefined,
      currentHardSelectIds: []
    };

    this.defaultPcsGridProps = {
      domLayout: 'autoHeight',
      suppressCellSelection: true,
      suppressClickEdit: true,
      suppressRowClickSelection: true, // Suppress so that a row is only selectable by checking the checkbox
      suppressLoadingOverlay: true,
      suppressNoRowsOverlay: true
    };

    this.subscriptions = [];
    this.clickStream = new Rx.Subject();
    this.resizeEvents = new Rx.Subject();
  }

  componentDidMount() {
    this.subscriptions.push(
      this.clickStream
        .debounceTime(Config.clickDebounceTime)
        .subscribe(clickAction => clickAction()),
      this.resizeEvents
        .debounceTime(Config.gridResizeDebounceTime)
        .filter(() => !!this.gridApi && !!this.props.sizeColumnsToFit)
        .subscribe(() => {
          // TODO: Move constant values to central location
          if (window.outerWidth >= Config.gridMinResize) this.gridApi.sizeColumnsToFit();
        })
    );
    window.addEventListener('resize', this.registerResizeEvent);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.registerResizeEvent);
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  registerResizeEvent = () => this.resizeEvents.next('r');

  /** When new props are passed in, check if the soft select state needs to be updated */
  componentWillReceiveProps(nextProps) {
    if (this.state.currentSoftSelectId !== nextProps.softSelectId) {
      this.setState({ currentSoftSelectId: nextProps.softSelectId }, this.refreshRows);
    }
  }

  /** Ensure that hard selected rows are maintained by their ids, even when the actual data may change */
  componentDidUpdate(nextProps, nextState) {
    const { getSoftSelectId } = this.props;
    const { currentHardSelectIds } = this.state;

    if (this.gridApi && isFunc(getSoftSelectId) && currentHardSelectIds && currentHardSelectIds.length > 0) {
      const idSet = new Set((currentHardSelectIds || []));

      this.gridApi.forEachNode(node => {
        if (idSet.has(getSoftSelectId(node.data)) && !node.selected) {
          node.setSelected(true);
        }
      });
    }
  }

  /** Save the gridApi locally on load */
  onGridReady = gridReadyEvent => {
    this.gridApi = gridReadyEvent.api;
    if (this.props.sizeColumnsToFit) {
      this.gridApi.sizeColumnsToFit();
    }
    if (isFunc(this.props.onGridReady)) {
      this.props.onGridReady(gridReadyEvent);
    }
  }

  /**
   * Refreshes the grid to update soft select CSS states
   * Forces and update event
   */
  refreshRows = () => {
    if (this.gridApi && isFunc(this.gridApi.updateRowData))
      this.gridApi.updateRowData({ update: [] });
  }

  /** When a row is hard selected, try to fire a hard select event, plus any props callbacks */
  onSelectionChanged = () => {
    if (isFunc(this.props.getSoftSelectId)) {
      const currentHardSelectIds = this.gridApi.getSelectedRows().map(this.props.getSoftSelectId);
      this.setState({ currentHardSelectIds });
    }

    const { onHardSelectChange, onSelectionChanged } = this.props;
    if (isFunc(onHardSelectChange)) {
      onHardSelectChange(this.gridApi.getSelectedRows());
    }
    if (isFunc(onSelectionChanged)) {
      onSelectionChanged();
    }
  };

  /** When a row is selected, try to fire a soft select event, plus any props callbacks */
  onRowClicked = rowEvent => {
    this.clickStream.next(
      () => {
        const { onSoftSelectChange, onRowClicked } = this.props;
        if (isFunc(onSoftSelectChange)) {
          onSoftSelectChange(rowEvent.data, rowEvent);
        }
        if (isFunc(onRowClicked)) onRowClicked(rowEvent);
      }
    );
  };

  onRowDoubleClicked = rowEvent => {
    this.clickStream.next(
      () => {
        const { onRowDoubleClicked } = this.props;
        if (isFunc(onRowDoubleClicked)) onRowDoubleClicked(rowEvent);
      }
    );
  };

  render() {
    const gridParams = {
      ...this.defaultPcsGridProps,
      ...this.props,
      headerHeight: ROW_HEIGHT,
      rowHeight: ROW_HEIGHT,
      onGridReady: this.onGridReady,
      onSelectionChanged: this.onSelectionChanged,
      onRowClicked: this.onRowClicked,
      onRowDoubleClicked: this.onRowDoubleClicked,
      rowClassRules: {
        'pcs-row-soft-selected': ({ data }) =>
          isFunc(this.props.getSoftSelectId)
            ? this.props.getSoftSelectId(data) === this.props.softSelectId
            : false
      }
    };
    const { rowData, pcsLoadingTemplate } = this.props;

    const loadingContainer =
      <div className="pcs-grid-loading-container">
        { !pcsLoadingTemplate ? <Indicator /> : pcsLoadingTemplate }
      </div>;

    return (
      <div className="pcs-grid-container ag-dark pcs-ag-dark">
        { !rowData ? loadingContainer : ''}
        <AgGridReact {...gridParams} />
      </div>
    );
  }
}
