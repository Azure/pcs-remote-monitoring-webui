// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { isFunc, joinClasses } from 'utilities';

import './styles/formGroup.css';

let idCounter = 0;

export class FormGroup extends Component {

  constructor(props) {
    super(props);
    this.formGroupId = `formGroupId${idCounter++}`;
  }

  render() {
    // Attach the formGroupId to allow automatic focus when a label is clicked
    const childrenWithProps = React.Children.map(this.props.children,
      child => {
        if (React.isValidElement(child) && isFunc(child.type)) {
          return React.cloneElement(child, { formGroupId: this.formGroupId });
        }
        return child;
      }
    );
    return <div className={joinClasses('form-group', this.props.className)}>{childrenWithProps}</div>;
  }
}

FormGroup.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
