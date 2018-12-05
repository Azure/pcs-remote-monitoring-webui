// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Duration } from './duration';
import { Select } from './select';
import { ErrorMsg } from './errorMsg';
import { joinClasses, isFunc, Link } from 'utilities';

import './styles/formControl.scss';

export class FormControl extends Component {
  constructor(props) {
    super(props);

    this.state = { edited: false };
  }

  onChange = (evt) => {
    const { onChange, link } = this.props;
    if (link && isFunc(link.onChange)) link.onChange(evt);
    if (isFunc(onChange)) onChange(evt);

    !this.state.edited && this.setState({ edited: true });
  }

  onBlur = (evt) => {
    if (this.props.onBlur) this.props.onBlur(evt);
    !this.state.edited && this.setState({ edited: true });
  }

  selectControl(type, controlProps) {
    switch(type) {
      case 'text':
        return <input type="text" {...controlProps} />;
      case 'password':
        return <input type="password" {...controlProps} />;
      case 'number':
        return <input type="number" {...controlProps} />;
      case 'textarea':
        return <textarea type="text" {...controlProps} />;
      case 'duration':
        return <Duration {...controlProps} />;
      case 'select':
        return <Select {...controlProps} />;
      default:
        return null; // Unknown form control
    }
  }

  getErrorMsg(link, error = '') {
    return link ? link.error : error;
  }

  render() {
    const { type, formGroupId, className, link, error, errorState, ...rest } = this.props;
    const valueOverrides = link ? { value: link.value }: {};
    const errorMsg =
      (typeof errorState === 'undefined' && this.state.edited && !rest.disabled)
        ? this.getErrorMsg(link, error)
        : '';
    const controlProps = {
      ...rest,
      id: rest.id || formGroupId,
      className: joinClasses('form-control', className, errorState || errorMsg ? 'error' : ''),
      onChange: this.onChange,
      onBlur: this.onBlur,
      ...valueOverrides
    };
    return (
      <div className="form-control-container">
        { this.selectControl(type, controlProps) }
        { errorMsg && <ErrorMsg>{ errorMsg }</ErrorMsg> }
      </div>
    );
  }
}

FormControl.propTypes = {
  type: PropTypes.oneOf([
    'text',
    'password',
    'number',
    'textarea',
    'duration',
    'select'
  ]).isRequired,
  errorState: PropTypes.bool,
  formGroupId: PropTypes.string,
  link: PropTypes.instanceOf(Link),
  error: PropTypes.string,
  className: PropTypes.string
};
