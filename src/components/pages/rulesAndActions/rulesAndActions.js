// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import PageContainer from '../../layout/pageContainer/pageContainer.js';
import PageContent from '../../layout/pageContent/pageContent.js';
import TopNav from '../../layout/topNav/topNav.js';
import ContextFilters from '../../layout/contextFilters/contextFilters.js';
import RulesActionsList from '../../../components/rulesActionsList/rulesActionsList';
import ManageFilterBtn from '../../shared/contextBtns/manageFiltersBtn';
import lang from '../../../common/lang';

class RulesAndActionsPage extends Component {
  render() {
    return (
      <PageContainer>
        <TopNav breadcrumbs={'Rules and Actions'} projectName={lang.DASHBOARD.AZUREPROJECTNAME} />
        <ContextFilters>
          <ManageFilterBtn />
        </ContextFilters>
        <PageContent>
          <RulesActionsList />
        </PageContent>
      </PageContainer>
    );
  }
}

export default RulesAndActionsPage;