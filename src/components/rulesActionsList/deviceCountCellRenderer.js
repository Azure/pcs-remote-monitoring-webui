// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import ApiService from "../../common/apiService";
import {connect} from "react-redux";
import Spinner from "../spinner/spinner";

class DeviceCountCellRenderer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: props.data.DeviceCount === undefined,
            count: props.data.DeviceCount || 0,
            cell: {
                row: props.data,
                col: props.colDef.headerName
            }
        };
    }

    componentDidMount() {
        if(!this.props.data.apiCallStarted){
            this.props.node.setData(Object.assign({}, this.props.data, {apiCallStarted: true}));
            let matchedGroup = this.props.deviceGroups.filter(group => group.Id === this.state.cell.row.GroupId);
            if (!matchedGroup.length) {
                this.props.node.setData(Object.assign({}, this.props.data, {apiCallStarted: true, DeviceCount: 0}));
                return;
            }
            ApiService.getDevicesForGroup(matchedGroup[0].Conditions)
                .then(response => {
                    if (response.items !== undefined) {
                        this.props.node.setData(Object.assign({}, this.props.data, {apiCallStarted: true, Devices: response.items,  DeviceCount: response.items.length}));
                    }
                })
                .catch(err => {
                    this.props.node.setData(Object.assign({}, this.props.data, {apiCallStarted: true, DeviceCount: 0}));
                })
        }
    }

    render() {
        return (
            this.state.loading
                ? <div className="loading-spinner-cell">
                    <Spinner size='small'/>
                </div>
                : <div> {this.state.count} </div>
        )
    }
}

const mapStateToProps = state => ({
    deviceGroups: state.filterReducer.deviceGroups
});

export default connect(mapStateToProps, null)(DeviceCountCellRenderer);
