// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { PageContent, ContextMenu } from 'components/shared';

export const RuleDetails = ({ match: { params: { id } } }) => [
  <ContextMenu key="context-menu"></ContextMenu>,
  <PageContent className="maintenance-container" key="page-content">
    <div className="header">{id}</div>
  </PageContent>
];
