// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import ApiService from "../../common/apiService";
import {connect} from "react-redux";

class LastTriggerCellRenderer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            lastTrigger: null,
            cell: {
                row: props.data,
                col: props.colDef.headerName
            }
        };
    }

    componentDidMount() {
        let matchedGroup = this.props.deviceGroups.filter(group => group.id === this.state.cell.row.GroupId);
        if (!matchedGroup.length) {
            return;
        }
        ApiService.getDevicesForGroup(matchedGroup[0].conditions)
            .then(response => {
                if (response.items) {
                    return ApiService.getAlarmListByRule(
                        this.state.cell.row.Id,
                        {
                            order: 'desc',
                            devices: response.items.map(device => device.Id).toString()
                        }
                    );
                }
            })
            .then(response => {
                if (response.Items && response.Items.length) {
                    this.setState({lastTrigger: Date.parse(response.Items[0].DateModified).toLocaleString()});
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        return (
            this.state.loading || !this.state.lastTrigger
                ? <div> ‐ ‐ ‐ ‐ ‐ ‐ ‐ ‐ ‐</div>
                : <div> {this.state.lastTrigger} </div>
        )
    }
}

const mapStateToProps = state => ({
    deviceGroups: state.filterReducer.deviceGroups
});

export default connect(mapStateToProps, null)(LastTriggerCellRenderer);
