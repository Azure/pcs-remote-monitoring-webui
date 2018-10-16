// Copyright (c) Microsoft. All rights reserved.

// <grid>

import React, { Component } from 'react';
import { Btn, ComponentArray, PcsGrid } from 'components/shared';
import { exampleColumnDefs, defaultExampleGridProps } from './exampleGridConfig';
import { isFunc, svgs, translateColumnDefs } from 'utilities';
import { checkboxColumn } from 'components/shared/pcsGrid/pcsGridConfig';

const initialState = {
  softSelectedObj: undefined
};

/**
 * A grid for displaying example data
 *
 * Encapsulates the PcsGrid props
 */
export class ExampleGrid extends Component {
  constructor(props) {
    super(props);

    // Set the initial state
    this.state = initialState;

    // Default device grid columns
    this.columnDefs = [
      checkboxColumn,
      exampleColumnDefs.id,
      exampleColumnDefs.description
    ];

    // Set up the available context buttons.
    // If these are subject to user permissions, use the Protected component (src/components/shared/protected).
    this.contextBtns =
      <ComponentArray>
        <Btn svg={svgs.reconfigure} onClick={this.clickContextBtn('btn1')}>{props.t('walkthrough.pageWithGrid.grid.btn1')}</Btn>
        <Btn svg={svgs.trash} onClick={this.clickContextBtn('btn2')}>{props.t('walkthrough.pageWithGrid.grid.btn2')}</Btn>
      </ComponentArray>;
  }

  /**
   * Get the grid api options
   *
   * @param {Object} gridReadyEvent An object containing access to the grid APIs
  */
  onGridReady = gridReadyEvent => {
    this.gridApi = gridReadyEvent.api;
    // Call the onReady props if it exists
    if (isFunc(this.props.onGridReady)) {
      this.props.onGridReady(gridReadyEvent);
    }
  };

  clickContextBtn = (input) => () => {
    //Just for demo purposes. Don't console log in a real grid.
    console.log('Context button clicked', input);
    console.log('hard selected rows', this.gridApi.getSelectedRows());
  };

  /**
   * Handles soft select props method.
   * Soft selection happens when the user clicks on the row.
   *
   * @param rowId The id of the currently soft selected item
   * @param rowEvent The rowEvent to pass on to the underlying grid
   */
  onSoftSelectChange = (rowId, rowEvent) => {
    const { onSoftSelectChange } = this.props;
    const obj = (this.gridApi.getDisplayedRowAtIndex(rowId) || {}).data;
    if (obj) {
      console.log('Soft selected', obj); //Just for demo purposes. Don't console log a real grid.
      this.setState({ softSelectedObj: obj });
    }
    if (isFunc(onSoftSelectChange)) {
      onSoftSelectChange(obj, rowEvent);
    }
  }

  /**
   * Handles context filter changes and calls any hard select props method.
   * Hard selection happens when the user checks the box for the row.
   *
   * @param {Array} selectedObjs A list of currently selected objects in the grid
   */
  onHardSelectChange = (selectedObjs) => {
    const { onContextMenuChange, onHardSelectChange } = this.props;
    // Show the context buttons when there are rows checked.
    if (isFunc(onContextMenuChange)) {
      onContextMenuChange(selectedObjs.length > 0 ? this.contextBtns : null);
    }
    if (isFunc(onHardSelectChange)) {
      onHardSelectChange(selectedObjs);
    }
  }

  getSoftSelectId = ({ id } = '') => id;

  render() {
    const gridProps = {
      /* Grid Properties */
      ...defaultExampleGridProps,
      columnDefs: translateColumnDefs(this.props.t, this.columnDefs),
      sizeColumnsToFit: true,
      getSoftSelectId: this.getSoftSelectId,
      softSelectId: (this.state.softSelectedDevice || {}).id,
      ...this.props, // Allow default property overrides
      deltaRowDataMode: true,
      enableSorting: true,
      unSortIcon: true,
      getRowNodeId: ({ id }) => id,
      context: {
        t: this.props.t
      },
      /* Grid Events */
      onRowClicked: ({ node }) => node.setSelected(!node.isSelected()),
      onGridReady: this.onGridReady,
      onSoftSelectChange: this.onSoftSelectChange,
      onHardSelectChange: this.onHardSelectChange
    };

    return (
      <PcsGrid key="example-grid-key" {...gridProps} />
    );
  }
}
// </grid>
