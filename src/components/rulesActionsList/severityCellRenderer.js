// Copyright (c) Microsoft. All rights reserved.

import React from "react";

export default class SeverityCellRenderer extends React.Component {

    render() {

        let severityClass = null;
        if (this.props.value.toLowerCase() === 'warning') {
            severityClass = 'severityGroup-warning';
        } else if (this.props.value.toLowerCase() === 'critical') {
            severityClass = 'severityGroup-critical';
        }
        return (
            <div className="severityGroup ">
                <div className={severityClass}/>
                <div className="severityGroup-text">{this.props.value}</div>
            </div>
        )
    }
}