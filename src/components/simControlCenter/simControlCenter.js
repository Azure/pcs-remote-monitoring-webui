// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import lang from '../../common/lang';
import PcsBtn from '../shared/pcsBtn/pcsBtn';
import simControlCenter from '../../assets/icons/SIMControlCenter.svg';

import './simControlCenter.css';

class SimControlCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false
        }
    }

    showToolTip = () => {
        this.setState({ isShow: true });
    }

    hideToolTip = () => {
        this.setState({ isShow: false });
    }

    render() {
        return (
            <div className="simControlCenter">
                <PcsBtn
                    svg={simControlCenter}
                    onMouseOver={this.showToolTip}
                    onMouseOut={this.hideToolTip}
                    value={lang.DEVICE_DETAIL.SIM_CONTROL_CENTER} />
                <div className={`toolTip ${this.state.isShow ? 'show' : 'hide'}`}>
                    {lang.DEVICE_DETAIL.COMING_SOON}
                </div>
            </div>
        );
    }
}

export default SimControlCenter;
