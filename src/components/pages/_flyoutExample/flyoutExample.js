// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { Btn, ContextMenu, PageContent } from 'components/shared';
import { svgs } from 'utilities';
import { ExampleFlyoutContainer } from './flyouts/exampleFlyout';

import './flyoutExample.css';

const closedFlyoutState = { openFlyoutName: undefined };

export class FlyoutExample extends Component {
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
        <Btn svg={svgs.reconfigure} onClick={this.openFlyout('example')}>{t('examples.flyout.open')}</Btn>
      </ContextMenu>,
      <PageContent className="flyout-example-container" key="page-content">
        {t('examples.flyout.pageBody')}
        { isExampleFlyoutOpen && <ExampleFlyoutContainer onClose={this.closeFlyout} /> }
      </PageContent>
    ];
  }
}
