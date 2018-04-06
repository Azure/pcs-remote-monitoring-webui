// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { Svg } from 'components/shared';
import { isFunc, svgs, joinClasses } from 'utilities';

import './styles/toggleBtn.css';

export class ToggleBtn extends Component  {

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
    const { value, disabled, className } = this.props;

    const svgProps = {
      path: svgs.loadingToggle,
      className: joinClasses('pcs-toggle', className ? className : '')
    };

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
      </div>
  );
  }

}

export default ToggleBtn;
