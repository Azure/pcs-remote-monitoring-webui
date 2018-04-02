// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { PcsGrid } from 'components/shared';
import { isFunc, translateColumnDefs } from 'utilities';
import { rulesColumnDefs } from 'components/pages/rules/rulesGrid/rulesGridConfig';
import { LastTriggerRenderer } from 'components/shared/cellRenderers';

const columnDefs = [
  rulesColumnDefs.ruleName,
  rulesColumnDefs.description,
  rulesColumnDefs.severity,
  {
    headerName: 'Total Count', // TODO: Translate
    field: 'counts.total'
  },
  {
    headerName: 'Open', // TODO: Translate
    field: 'counts.open'
  },
  {
    headerName: 'Ack', // TODO: Translate
    field: 'counts.acknowledged'
  },
  {
    headerName: 'Closed', // TODO: Translate
    field: 'counts.closed'
  },
  {
    headerName: 'Last Occurrence', // TODO: Translate
    field: 'lastOccurrence',
    cellRendererFramework: LastTriggerRenderer
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
