// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import PropTypes from 'prop-types';

import { joinClasses } from 'utilities';
import { SectionHeader } from 'components/shared';

import './styles/summarySection.css';

export const SummarySection = (props) => (
  <div className={joinClasses('summary-section', props.className)}>
    <SectionHeader>
      <div className="summary-title">{props.title}</div>
    </SectionHeader>
    <div className="summary-contents-container">
      {props.children}
    </div>
  </div>
);

SummarySection.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string
};
