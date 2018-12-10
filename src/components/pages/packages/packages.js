// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { permissions, toDiagnosticsModel } from 'services/models';
import { PackagesGrid } from './packagesGrid';
import {
  AjaxError,
  Btn,
  ComponentArray,
  ContextMenu,
  ContextMenuAlign,
  PageContent,
  Protected,
  RefreshBarContainer as RefreshBar,
  PageTitle
} from 'components/shared';
import { PackageNewContainer } from './flyouts';
import { svgs } from 'utilities';

import './packages.scss';

const closedFlyoutState = { openFlyoutName: undefined };

export class Packages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...closedFlyoutState,
      contextBtns: null
    };

    this.props.updateCurrentWindow('Packages');

    this.props.fetchPackages();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPending && nextProps.isPending !== this.props.isPending) {
      // If the grid data refreshes, hide the flyout
      this.setState(closedFlyoutState);
    }
  }

  closeFlyout = () => {
    this.props.logEvent(toDiagnosticsModel('Packages_NewClose', {}));
    this.setState(closedFlyoutState);
  }

  onContextMenuChange = contextBtns => this.setState({
    contextBtns,
    openFlyoutName: undefined
  });

  openNewPackageFlyout = () => {
    this.props.logEvent(toDiagnosticsModel('Packages_NewClick', {}));
    this.setState({
      openFlyoutName: 'new-Package'
    });
  }

  render() {
    const { t, packages, error, isPending, fetchPackages, lastUpdated } = this.props;
    const gridProps = {
      rowData: isPending ? undefined : packages || [],
      onContextMenuChange: this.onContextMenuChange,
      t: this.props.t
    };

    return (
      <ComponentArray>
        <ContextMenu>
          <ContextMenuAlign left={true}>
            { /* Add left aligned items as needed */}
          </ContextMenuAlign>
          <ContextMenuAlign>
            {this.state.contextBtns}
            <Protected permission={permissions.createPackages}>
              <Btn svg={svgs.plus} onClick={this.openNewPackageFlyout}>{t('packages.new')}</Btn>
            </Protected>
          </ContextMenuAlign>
        </ContextMenu>
        <PageContent className="package-container">
          <RefreshBar refresh={fetchPackages} time={lastUpdated} isPending={isPending} t={t} />
          <PageTitle className="package-title" titleValue={t('packages.title')} />
          {!!error && <AjaxError t={t} error={error} />}
          {!error && <PackagesGrid {...gridProps} />}
          {this.state.openFlyoutName === 'new-Package' && <PackageNewContainer t={t} onClose={this.closeFlyout} />}
        </PageContent>
      </ComponentArray>
    );
  }
}
