// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { PageContent } from 'components/shared';

import './example.css';

export class Example extends Component {
  render() {
    const { t } = this.props;
    return (
      <PageContent className="example-container">
        { t('examples.pagePlaceholder') }
      </PageContent>
    );
  }
}
