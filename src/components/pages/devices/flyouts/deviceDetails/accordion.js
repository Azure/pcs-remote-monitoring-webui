// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Btn,
  SectionHeader,
  SectionDesc
} from 'components/shared';
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
    const displayContent = this.state.showContent ? {} : { display: 'none' };
    return (
      <div className={joinClasses('accordion', className)}>
        <SectionHeader>
          <div className="accordion-title" onClick={this.toggleContent}>{title}</div>
          <Btn onClick={this.toggleContent} svg={svgs.chevron} className={joinClasses("accordion-toggle-btn", this.state.showContent ? 'chevron-close' : 'chevron-open')} />
        </SectionHeader>

        <div className="section-content" style={displayContent}>
          {
            description &&
            <SectionDesc>{description}</SectionDesc>
          }
          {children}
        </div>
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
