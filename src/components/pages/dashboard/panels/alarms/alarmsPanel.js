// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { Indicator } from 'components/shared';
import {
  Panel,
  PanelHeader,
  PanelHeaderLabel,
  PanelContent,
  PanelOverlay,
  PanelError
} from 'components/pages/dashboard/panel';
import { RulesGrid, rulesColumnDefs } from 'components/pages/rules/rulesGrid';
import { translateColumnDefs } from 'utilities';

export class AlarmsPanel extends Component {

  constructor(props) {
    super(props);

    this.columnDefs = [
      {
        ...rulesColumnDefs.ruleName,
        minWidth: 200
      },
      rulesColumnDefs.severity,
      {
        headerName: 'rules.grid.count',
        field: 'count'
      },
      rulesColumnDefs.explore
    ];
  }

  render() {
    const { t, alarms, isPending, error } = this.props;
    const gridProps = {
      columnDefs: translateColumnDefs(t, this.columnDefs),
      rowData: alarms,
      t
    };
    const showOverlay = isPending && !alarms.length;
    return (
      <Panel className="alarms-panel-container">
        <PanelHeader>
          <PanelHeaderLabel>{t('dashboard.panels.alarms.header')}</PanelHeaderLabel>
          { !showOverlay && isPending && <Indicator size="small" /> }
        </PanelHeader>
        <PanelContent>
          <RulesGrid {...gridProps} />
        </PanelContent>
        { showOverlay && <PanelOverlay><Indicator /></PanelOverlay> }
        { error && <PanelError>{ t('errorFormat', { message: t(error.message, { message: error.errorMessage }) }) }</PanelError> }
      </Panel>
    );
  }
}
