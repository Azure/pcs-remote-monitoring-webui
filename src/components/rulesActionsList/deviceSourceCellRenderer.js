// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import {connect} from "react-redux";

class DeviceSourceCellRenderer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            source: '',
            cell: {
                row: props.data,
                col: props.colDef.headerName
            }
        };
    }

    componentDidMount() {
        let matchedGroup = this.props.deviceGroups.filter(group => group.Id === this.props.value);
        if (matchedGroup.length) {
            this.setState({source: matchedGroup[0].DisplayName});
        }
    }

    render() {
        return (
            <div> {this.state.source} </div>
        )
    }
}

const mapStateToProps = state => ({
    deviceGroups: state.filterReducer.deviceGroups
});

export default connect(mapStateToProps, null)(DeviceSourceCellRenderer);
