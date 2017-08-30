// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import ApiService from "../../common/apiService";
import {connect} from "react-redux";

class DeviceCountCellRenderer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            count: 0,
            cell: {
                row: props.data,
                col: props.colDef.headerName
            }
        };
    }

    componentDidMount() {
        let matchedGroup = this.props.deviceGroups.filter(group => group.id === this.state.cell.row.GroupId);
        if (!matchedGroup.length) {
            this.setState({loading: false, count: 0});
            this.props.node.setData(Object.assign({}, this.props.data, {DeviceCount: 0}));
            return;
        }
        ApiService.getDevicesForGroup(matchedGroup[0].conditions)
            .then(response => {
                if (response.items !== undefined) {
                    this.props.node.setData(Object.assign({}, this.props.data, {DeviceCount: response.items.length}));
                    this.setState({loading: false, count: response.items.length})
                }
            })
            .catch(err => {
                this.props.node.setData(Object.assign({}, this.props.data, {DeviceCount: 0}));
                this.setState({loading: false, count: 0})
            })
    }

    render() {
        return (
            this.state.loading
                ? <div className="cell-loading"/>
                : <div> {this.state.count} </div>
        )
    }
}

const mapStateToProps = state => ({
    deviceGroups: state.filterReducer.deviceGroups
});

export default connect(mapStateToProps, null)(DeviceCountCellRenderer);
