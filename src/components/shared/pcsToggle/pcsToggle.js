// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { isFunction } from '../../../common/utils';

import ToggleOnSvg from '../../../assets/icons/EnableToggle.svg';
import ToggleOffSvg from '../../../assets/icons/DISABLE_toggle.svg';
import ToggleDisabledSvg from '../../../assets/icons/Disable.svg';

import './pcsToggle.css';

class PscToggle extends React.Component {

  onChange = () => {
    const { onChange, name, value } = this.props;
    if (isFunction(onChange)) {
      const event = {
        target: { name, value: !value }
      };
      onChange(event);
    }
  };

  render() {
    const { value, disabled, className } = this.props;

    const imgProps = {
      src: ToggleDisabledSvg,
      className: `pcs-toggle ${className || ''}`
    };

    if (!disabled) {
      imgProps.src = value ? ToggleOnSvg : ToggleOffSvg;
      imgProps.onClick = this.onChange;
    } else {
      imgProps.className += ' disabled';
    }
    return (<img {...imgProps} alt="" />);
  }

}

export default PscToggle;
