// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { svgs } from 'utilities';
import Shell from "components/shell/shell";
import { DashboardContainer, BasicPageContainer, PageWithFlyoutContainer, PageWithGridContainer } from './pages';

class App extends Component {
  openSettings = () => alert('There are no settings in the walkthrough.');

  render() {
    const pagesConfig = [
      {
        to: '/dashboard',
        exact: true,
        svg: svgs.tabs.dashboard,
        labelId: 'walkthrough.tabs.dashboard',
        component: DashboardContainer
      },
      {
        to: '/basicpage',
        exact: true,
        svg: svgs.tabs.example,
        labelId: 'walkthrough.tabs.basicPage',
        component: BasicPageContainer
      },
      {
        to: '/pagewithflyout',
        exact: true,
        svg: svgs.tabs.example,
        labelId: 'walkthrough.tabs.pageWithFlyout',
        component: PageWithFlyoutContainer
      },
      {
        to: '/pagewithgrid',
        exact: true,
        svg: svgs.tabs.example,
        labelId: 'walkthrough.tabs.pageWithGrid',
        component: PageWithGridContainer
      }
    ];

    const crumbsConfig = [
      {
        path: '/dashboard', crumbs: [
          { to: '/dashboard', labelId: 'walkthrough.tabs.dashboard' }
        ]
      },
      {
        path: '/basicpage', crumbs: [
          { to: '/basicpage', labelId: 'walkthrough.tabs.basicPage' }
        ]
      },
      {
        path: '/pagewithflyout', crumbs: [
          { to: '/pagewithflyout', labelId: 'walkthrough.tabs.pageWithFlyout' }
        ]
      },
      {
        path: '/pagewithgrid', crumbs: [
          { to: '/pagewithgrid', labelId: 'walkthrough.tabs.pageWithGrid' }
        ]
      }
    ];

    const shellProps = {
      pagesConfig,
      crumbsConfig,
      openSettings: this.openSettings,
      ...this.props
    };

    return (
      <Shell {...shellProps} />
    );
  }
}

export default App;
