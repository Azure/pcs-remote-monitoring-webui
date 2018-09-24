// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { Grid, Cell } from 'components/pages/dashboard/grid';

import { ExamplePanel } from './panels';
import { ComponentArray, ContextMenu, PageContent } from 'components/shared';

import './dashboard.css';

const initialState = {};

export class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = initialState;
  }

  render() {
    const { t } = this.props;

    return (
      <ComponentArray>
        <ContextMenu>
          {/** Add context buttons here... as needed for your dashboard. In this example, there are none. */}
        </ContextMenu>
        <PageContent className="dashboard-container">
          <Grid>
            <Cell className="col-4">
              <ExamplePanel t={t} />
            </Cell>
            <Cell className="col-6">
              <ExamplePanel t={t} />
            </Cell>
            <Cell className="col-2">
              <ExamplePanel t={t} />
            </Cell>
            <Cell className="col-2">
              <ExamplePanel t={t} />
            </Cell>
            <Cell className="col-2">
              <ExamplePanel t={t} />
            </Cell>
            <Cell className="col-2">
              <ExamplePanel t={t} />
            </Cell>
            <Cell className="col-2">
              <ExamplePanel t={t} />
            </Cell>
          </Grid>
        </PageContent>
      </ComponentArray>
    );
  }
}
