// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { PcsGrid } from 'components/shared';
import { isFunc, translateColumnDefs } from 'utilities';
import { rulesColumnDefs } from 'components/pages/rules/rulesGrid/rulesGridConfig';
import { TimeRenderer } from 'components/shared/cellRenderers';

const columnDefs = [
  rulesColumnDefs.ruleName,
  rulesColumnDefs.description,
  rulesColumnDefs.severity,
  {
    headerName: 'maintenance.alertGrid.totalCount',
    field: 'counts.total'
  },
  {
    headerName: 'maintenance.alertGrid.open',
    field: 'counts.open'
  },
  {
    headerName: 'maintenance.alertGrid.acknowledged',
    field: 'counts.acknowledged'
  },
  {
    headerName: 'maintenance.alertGrid.closed',
    field: 'counts.closed'
  },
  {
    headerName: 'maintenance.alertGrid.lastOccurrence',
    field: 'lastOccurrence',
    cellRendererFramework: TimeRenderer
  }
];

export class AlertGrid extends Component {

  onGridReady = gridReadyEvent => {
    this.gridApi = gridReadyEvent.api;
    gridReadyEvent.api.sizeColumnsToFit();
    // Call the onReady props if it exists
    if (isFunc(this.props.onGridReady)) {
      this.props.onGridReady(gridReadyEvent);
    }
  };

  render () {
    const { t, ...props } = this.props;
    const gridProps = {
      columnDefs: translateColumnDefs(t, columnDefs),
      context: { t },
      onGridReady: this.onGridReady,
      ...props
    };
    return (
      <PcsGrid {...gridProps} />
    );
  }
}
