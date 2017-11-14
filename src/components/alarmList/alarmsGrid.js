// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import PcsGrid from '../pcsGrid/pcsGrid';

import { alarmColumnDefs, defaultAlarmGridProps } from './alarmsGridConfig';
import { isFunction } from '../../common/utils';

/**
 * A grid for displaying alarms by rule
 *
 * Encapsulates the PcsGrid props
 */
class AlarmsGrid extends Component {
  constructor(props) {
    super(props);

    // Default device grid columns
    this.columnDefs = [
      alarmColumnDefs.name,
      alarmColumnDefs.severity,
      alarmColumnDefs.occurrences,
      alarmColumnDefs.explore
    ];
  }

  /**
   * Get the grid api options
   *
   * @param {Object} gridReadyEvent An object containing access to the grid APIs
   */
  onGridReady = gridReadyEvent => {
    gridReadyEvent.api.sizeColumnsToFit();
    // Call the onReady props if it exists
    if (isFunction(this.props.onGridReady)) {
      this.props.onGridReady(gridReadyEvent);
    }
  };

  render() {
    const gridProps = {
      /* Grid Properties */
      ...defaultAlarmGridProps,
      columnDefs: this.columnDefs,
      ...this.props, // Allow default property overrides
      /* Grid Events */
      onGridReady: this.onGridReady
    };
    return (
      <PcsGrid {...gridProps} />
    );
  }
}


export default AlarmsGrid;
