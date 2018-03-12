// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { Svg } from 'components/shared';
import { svgs } from 'utilities';

import {
  Panel,
  PanelHeader,
  PanelContent
} from 'components/pages/dashboard/panel';
import { RulesGrid, rulesColumnDefs } from 'components/pages/rules/rulesGrid';
import { translateColumnDefs } from 'utilities';

import './alarmsPanel.css';

export class AlarmsPanel extends Component {

  constructor(props) {
    super(props);

    this.columnDefs = [
      rulesColumnDefs.ruleName,
      rulesColumnDefs.severity,
      {
        headerName: 'rules.grid.count',
        field: 'count'
      },
      {
        headerName: 'Explore',
        field: 'ruleId',
        cellRendererFramework: ({ value }) =>
          <NavLink to={`/maintenance/rule/${value}`} className="alarms-explore-link">
            <Svg path={svgs.ellipsis} />
          </NavLink>
      }
    ];
  }

  componentDidMount() {
    if (!this.props.rulesLastUpdated) this.props.fetchRules();
    this.props.fetchAlarms();
  }

  render() {
    const { t, alarms, isPending } = this.props;
    const gridProps = {
      columnDefs: translateColumnDefs(t, this.columnDefs),
      rowData: !isPending ? alarms : undefined,
      t
    };
    return (
      <Panel className="alarms-panel-container">
        <PanelHeader>System alarms</PanelHeader>
        <PanelContent>
          <RulesGrid {...gridProps} />
        </PanelContent>
      </Panel>
    );
  }
}
