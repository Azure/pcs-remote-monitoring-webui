// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Svg } from 'components/shared';
import { isFunc, svgs, joinClasses } from 'utilities';
import { FormLabel } from './formLabel';
import './styles/toggleBtn.css';

export class ToggleBtn extends Component {

  onChange = () => {
    const { onChange, name, value } = this.props;
    if (isFunc(onChange)) {
      const event = {
        target: { name, value: !value }
      };
      onChange(event);
    }
  };

  render() {
    const { value, disabled, className, children } = this.props;

    const svgProps = {
      path: svgs.loadingToggle,
      className: joinClasses('pcs-toggle', className ? className : '')
    };
    let contentChildren = children;
    if (typeof contentChildren === 'string') {
      contentChildren = <FormLabel>{contentChildren}</FormLabel>;
    }
    const childrenWithProps = React.Children.map(contentChildren,
      (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            formGroupId: `${this.formGroupId}_child`,
            disabled: disabled || (value === undefined ? false : !value)
          });
        }
        return child;
      }
    );
    if (!disabled) {
      svgProps.path = value ? svgs.enableToggle : svgs.disableToggle;
      svgProps.onClick = this.onChange;
      svgProps.className = joinClasses(svgProps.className, value ? ' enable-toggle' : ' disable-toggle');
    } else {
      svgProps.className = joinClasses(svgProps.className, ' disabled');
    }
    return (
      <div className="toggle-btn-div">
        <Svg {...svgProps} alt="" />
        <div className="input-contents">{childrenWithProps}</div>
      </div>
    );
  }

}

export default ToggleBtn;
