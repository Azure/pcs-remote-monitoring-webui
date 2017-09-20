// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import lang from "../../common/lang";

export default class StatusCellRenderer extends React.Component {

    render() {
        return (
            this.props.value
                ? <div className="statusGroup ">
                <div className="statusGroup-enabled"/>
                <div className="statusGroup-text-enabled">{lang.ENABLED}</div>
            </div>
                : <div className="statusGroup">
                <div className="statusGroup-disabled"/>
                <div className="statusGroup-text-disabled">{lang.DISABLED}</div>
            </div>
        )
    }
}