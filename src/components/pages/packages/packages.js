// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { permissions } from 'services/models';
import { PackagesGrid } from './packagesGrid';
import {
  AjaxError,
  Btn,
  ContextMenu,
  PageContent,
  Protected,
  RefreshBar,
  PageTitle
} from 'components/shared';
import { NewPackage } from './flyouts';
import { svgs } from 'utilities';

import './packages.css';

const closedFlyoutState = { openFlyoutName: undefined };

export class Packages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...closedFlyoutState,
      contextBtns: null
    };

    if (!this.props.lastUpdated && !this.props.error) {
      this.props.fetchPackages();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPending && nextProps.isPending !== this.props.isPending) {
      // If the grid data refreshes, hide the flyout
      this.setState(closedFlyoutState);
    }
  }

  closeFlyout = () => this.setState(closedFlyoutState);

  onContextMenuChange = contextBtns => this.setState({
    contextBtns,
    openFlyoutName: undefined
  });

  openNewPackageFlyout = () => this.setState({
    openFlyoutName: 'new-Package'
  });

  onGridReady = gridReadyEvent => this.packageGridApi = gridReadyEvent.api;

  render() {
    const { t, packages, error, isPending, fetchPackages, lastUpdated } = this.props;
    const gridProps = {
      onGridReady: this.onGridReady,
      rowData: isPending ? undefined : packages || [],
      onContextMenuChange: this.onContextMenuChange,
      t: this.props.t
    };

    return [
      <ContextMenu key="context-menu">
        <RefreshBar refresh={fetchPackages} time={lastUpdated} isPending={isPending} t={t} />
        {this.state.contextBtns}
        <Protected permission={permissions.addPackages}>
          <Btn svg={svgs.plus} onClick={this.openNewPackageFlyout}>{t('packages.new')}</Btn>
        </Protected>
      </ContextMenu>,
      <PageContent className="package-container" key="page-content">
        <PageTitle className="package-title" titleValue={t('packages.title')} />
        {!!error && <AjaxError t={t} error={error} />}
        {!error && <PackagesGrid {...gridProps} />}
        {this.state.openFlyoutName === 'newPackage' && <NewPackage t={t} onClose={this.closeFlyout} />}
      </PageContent>
    ];
  }
}
