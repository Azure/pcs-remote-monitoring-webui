// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

export const RuleDetails = ({ match: { params: { id } } }) => (
  <div className="maintenance-container">
    <div className="header">{id}</div>
  </div>
);
