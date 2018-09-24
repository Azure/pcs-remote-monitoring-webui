// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import {
  AjaxError,
  ComponentArray,
  ContextMenu,
  PageContent,
  RefreshBar
} from 'components/shared';
import { ExampleGrid } from './exampleGrid';

import './pageWithGrid.css';

export class PageWithGrid extends Component {
  constructor(props) {
    super(props);
    this.state = { contextBtns: null };
  }

  componentDidMount() {
    const { isPending, lastUpdated, fetchData } = this.props;
    if (!lastUpdated && !isPending) fetchData();
  }

  onGridReady = gridReadyEvent => this.gridApi = gridReadyEvent.api;

  onContextMenuChange = contextBtns => this.setState({ contextBtns });

  render() {
    const { t, data, error, isPending, lastUpdated, fetchData } = this.props;
    const gridProps = {
      onGridReady: this.onGridReady,
      rowData: isPending ? undefined : data || [],
      onContextMenuChange: this.onContextMenuChange,
      t: this.props.t
    };

    return (
      <ComponentArray>
        <ContextMenu>
          {this.state.contextBtns}
        </ContextMenu>
        <PageContent className="page-with-grid-container">
          <RefreshBar refresh={fetchData} time={lastUpdated} isPending={isPending} t={t} />
          {!!error && <AjaxError t={t} error={error} />}
          {!error && <ExampleGrid {...gridProps} />}
        </PageContent>
      </ComponentArray>
    );
  }
}
