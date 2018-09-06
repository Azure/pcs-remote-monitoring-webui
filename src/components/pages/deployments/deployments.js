// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { PageContent } from 'components/shared';

import './deployments.css';

export class Deployments extends Component {
  // TODO

  render() {
    const { t } = this.props;
    return (
      <PageContent className="deployments-page-container">
        {t('deployments.header')}
      </PageContent>
    );
  }
}
