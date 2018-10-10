// Copyright (c) Microsoft. All rights reserved.

// <page>
import React, { Component } from 'react';

import { PageContent } from 'components/shared';

import './basicPage.css';

export class BasicPage extends Component {
  render() {
    const { t } = this.props;
    return (
      <PageContent className="basic-page-container">
        { t('walkthrough.basicPage.pagePlaceholder') }
      </PageContent>
    );
  }
}

// </page>
