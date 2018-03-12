// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { PcsGrid } from 'components/shared';
import { rulesColumnDefs, checkboxParams, defaultRulesGridProps } from './rulesGridConfig';
import { isFunc, translateColumnDefs } from 'utilities';

export class RulesGrid extends Component {
  constructor(props) {
    super(props);

    this.columnDefs = [
      { ...rulesColumnDefs.ruleName, ...checkboxParams },
      rulesColumnDefs.description,
      rulesColumnDefs.severity,
      rulesColumnDefs.filter,
      rulesColumnDefs.trigger,
      rulesColumnDefs.notificationType,
      rulesColumnDefs.status,
      rulesColumnDefs.count,
      rulesColumnDefs.lastTrigger
    ];
  }

  onGridReady = gridReadyEvent => {
    this.deviceGridApi = gridReadyEvent.api;
    gridReadyEvent.api.sizeColumnsToFit();
    // Call the onReady props if it exists
    if (isFunc(this.props.onGridReady)) {
      this.props.onGridReady(gridReadyEvent);
    }
  };

  render () {
    const gridProps = {
      /* Grid Properties */
      ...defaultRulesGridProps,
      columnDefs: translateColumnDefs(this.props.t, this.columnDefs),
      ...this.props, // Allow default property overrides
      context: {
        t: this.props.t
      },
      /* Grid Events */
      onGridReady: this.onGridReady
    };

    return  (
      <PcsGrid {...gridProps} />
    );
  }
}
