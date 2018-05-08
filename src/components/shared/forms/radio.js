// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Svg } from 'components/shared/svg/svg';
import { FormLabel } from './formLabel';
import { isFunc, svgs, joinClasses } from 'utilities';

import './styles/radio.css';

let radioInputCnt = 0;

export class Radio extends Component {

  constructor(props) {
    super(props);
    this.formGroupId = `radioInputId${radioInputCnt++}`;
  }

  // Needs to be a stateful component in order to access refs
  render() {
    const { className, children, id, disabled, link, formGroupId, ...rest } = this.props;
    const valueOverrides = link ? {
      checked: link.value === rest.value,
      onChange: link.onChange
    }: {};
    const radioProps = { ...rest, ...valueOverrides };
    let contentChildren = children;
    if (typeof contentChildren === 'string') {
      contentChildren = <FormLabel>{contentChildren}</FormLabel>;
    }
    const childrenWithProps = React.Children.map(contentChildren,
      (child) => {
        if (React.isValidElement(child) && isFunc(child.type)) {
          return React.cloneElement(child, {
            formGroupId: this.formGroupId,
            disabled: disabled || (radioProps.checked === undefined ? false : !radioProps.checked)
          });
        }
        return child;
      }
    );

    return (
      <div className={joinClasses('radio-container', className)}>
        <div className="radio-input-container">
          <input
            { ...radioProps }
            { ...valueOverrides }
            type="radio"
            disabled={disabled}
            id={id || this.formGroupId}
            ref="radioInputElement" />
          <Svg
            path={svgs.radioSelected}
            className={joinClasses('radio-icon', disabled ? 'disabled' : '')}
            onClick={() => this.refs.radioInputElement.click()} />
        </div>
        <div className="input-contents">{childrenWithProps}</div>
      </div>
    );
  }
}
//className, children, id, checked, disabled
Radio.propTypes = {
  checked: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
};
