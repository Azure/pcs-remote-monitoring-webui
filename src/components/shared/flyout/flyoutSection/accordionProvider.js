// Copyright (c) Microsoft. All rights reserved.

import React, { Component, Children } from'react';
import PropTypes from 'prop-types';

// A provider for passing accordion collapsed/expanded status to children
export class AccordionProvider extends Component {

  static childContextTypes = {
    accordionIsOpen: PropTypes.bool.isRequired,
    accordionIsCollapsable: PropTypes.bool.isRequired,
    toggleAccordion: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    const { isCollapsable = true } = this.props;
    this.state = {
      accordionIsOpen: true,
      accordionIsCollapsable: isCollapsable
    };
  }

  toggle = () => this.setState({ accordionIsOpen: !this.state.accordionIsOpen });

  getChildContext() {
    const { accordionIsOpen, accordionIsCollapsable } = this.state;
    return { accordionIsOpen, accordionIsCollapsable, toggleAccordion: this.toggle };
  }

  render() {
    return Children.only(this.props.children);
  }
}

// A helper HOC to access the accordion state
export const withAccordion = (ComponentToWrap) => {
  return class WithAccordionComponent extends Component {

    static contextTypes = {
      accordionIsOpen: PropTypes.bool.isRequired,
      toggleAccordion: PropTypes.func.isRequired,
      accordionIsCollapsable: PropTypes.bool.isRequired,
    };

    render() {
      const { accordionIsOpen, accordionIsCollapsable, toggleAccordion } = this.context;
      return (
        <ComponentToWrap {...this.props}
          accordionIsOpen={accordionIsOpen}
          accordionIsCollapsable={accordionIsCollapsable}
          toggleAccordion={toggleAccordion} />
      );
    }
  }
};

// A helper component for wrapping content that is collapsable or expandable
export const AccordionCollapsableContent = withAccordion(
  ({ accordionIsOpen, children }) => accordionIsOpen ? children : null
);
