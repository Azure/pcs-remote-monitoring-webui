// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  SectionHeader,
  SectionDesc
} from 'components/shared';
import { Svg } from 'components/shared/svg/svg';
import { svgs, joinClasses } from 'utilities';

import './accordion.css';

export class Accordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showContent: true
    };

    this.toggleContent = this.toggleContent.bind(this);
  }

  toggleContent() {
    this.setState({ showContent: !this.state.showContent });
  }

  render() {
    const { className, title, description, children } = this.props;
    const { showContent } = this.state;

    return (
      <div className={joinClasses('accordion', className)}>
        <SectionHeader>
          <div className="accordion-title" onClick={this.toggleContent}>{title}</div>
          <button onClick={this.toggleContent} className="accordion-toggle-btn">
            <Svg path={svgs.chevron} className={showContent ? 'chevron-close' : 'chevron-open'} />
          </button>
        </SectionHeader>

        {
          showContent &&
          <div className="section-content">
            {description && <SectionDesc>{description}</SectionDesc>}
            {children}
          </div>
        }
      </div>
    );
  }
}

Accordion.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
};
