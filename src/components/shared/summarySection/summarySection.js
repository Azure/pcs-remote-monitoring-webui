// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import lang from '../../../common/lang';

import './summarySection.css';

const SummarySection = ({ count = 0, content }) => (
  <div className="summary-container">
    {lang.SUMMARY}
    <div className="affected-devices">
      <span className="affected-devices-number">
        {count}
      </span>
      <span className="affected-devices-name">
        {content}
      </span>
    </div>
  </div>
);

export default SummarySection;
