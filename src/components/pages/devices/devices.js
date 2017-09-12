// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import PageContainer from '../../layout/pageContainer/pageContainer.js';
import PageContent from '../../layout/pageContent/pageContent.js';
import TopNav from '../../layout/topNav/topNav.js';
import ContextFilters from '../../layout/contextFilters/contextFilters.js';
import DevicesGrid from '../../devicesGrid/devicesGrid';
import lang from '../../../common/lang';

class DevicesPage extends Component {
  render() {
    return (
      <PageContainer>
        <TopNav breadcrumbs={'Devices'} projectName={lang.DASHBOARD.AZUREPROJECTNAME} />
        <ContextFilters></ContextFilters>
        <PageContent>
          <DevicesGrid />
        </PageContent>
      </PageContainer>
    );
  }
}

export default DevicesPage;
