// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { permissions } from 'services/models';
import { PackagesGrid } from './packagesGrid';
import { ManageDeviceGroupsBtnContainer as ManageDeviceGroupsBtn } from 'components/app/manageDeviceGroupsBtn';
import {
  AjaxError,
  Btn,
  ContextMenu,
  PageContent,
  Protected,
  RefreshBar
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
      // If the grid data refreshes, hide the flyout and deselect soft selections
      this.setState(closedFlyoutState);
    }
  }

  closeFlyout = () => this.setState(closedFlyoutState);

  openNewPackageFlyout = () => this.setState({
    openFlyoutName: 'newPackage',
    selectedPackageId: ''
  });

  onGridReady = gridReadyEvent => this.packageGridApi = gridReadyEvent.api;

  searchOnChange = ({ target: { value } }) => {
    if (this.packageGridApi) this.packageGridApi.setQuickFilter(value);
  };

  onContextMenuChange = contextBtns => this.setState({ contextBtns });

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
        {this.state.contextBtns}
        <Protected permission={permissions.addPackage}>
          <Btn svg={svgs.plus} onClick={this.appPackageFlyout}>{t('packages.flyouts.new.contextMenuName')}</Btn>
        </Protected>
        <ManageDeviceGroupsBtn />
      </ContextMenu>,
      <PageContent className="package-container" key="page-content">
        <RefreshBar refresh={fetchPackages} time={lastUpdated} isPending={isPending} t={t} />
        {!!error && <AjaxError t={t} error={error} />}
        {!error && <PackagesGrid {...gridProps} />}
        {this.state.openFlyoutName === 'newPackage' && <NewPackage t={t} onClose={this.closeFlyout} />}
      </PageContent>
    ];
  }
}
