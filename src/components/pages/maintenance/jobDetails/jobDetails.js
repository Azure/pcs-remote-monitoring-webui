// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

export const JobDetails = ({ match: { params: { id } } }) => (
  <div className="maintenance-container">
    <div className="header">{id}</div>
  </div>
);
