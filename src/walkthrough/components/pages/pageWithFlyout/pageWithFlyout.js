// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { Btn, ContextMenu, PageContent } from 'components/shared';
import { svgs } from 'utilities';
import { ExampleFlyoutContainer } from './flyouts/exampleFlyout';

import './pageWithFlyout.css';

const closedFlyoutState = { openFlyoutName: undefined };

export class PageWithFlyout extends Component {
  constructor(props) {
    super(props);
    this.state = closedFlyoutState;
  }

  closeFlyout = () => this.setState(closedFlyoutState);

  openFlyout = (name) => () => this.setState({ openFlyoutName: name });

  render() {
    const { t } = this.props;
    const { openFlyoutName } = this.state;

    const isExampleFlyoutOpen = openFlyoutName === 'example';

    return [
      <ContextMenu key="context-menu">
        <Btn svg={svgs.reconfigure} onClick={this.openFlyout('example')}>{t('walkthrough.pageWithFlyout.open')}</Btn>
      </ContextMenu>,
      <PageContent className="page-with-flyout-container" key="page-content">
        {t('walkthrough.pageWithFlyout.pageBody')}
        { isExampleFlyoutOpen && <ExampleFlyoutContainer onClose={this.closeFlyout} /> }
      </PageContent>
    ];
  }
}
