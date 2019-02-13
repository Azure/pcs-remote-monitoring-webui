// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { PageContent } from 'components/shared';

import './pageNotFound.scss';

export const PageNotFound = ({ t }) => (
  <PageContent className="page-not-found-container">
    { t('pageNotFound.title') }
    <br />
    <br />
    <span className="quote">{ t('pageNotFound.message') }</span>
  </PageContent>
);
