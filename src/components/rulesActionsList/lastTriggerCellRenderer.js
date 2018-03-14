// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import ApiService from "../../common/apiService";
import {connect} from "react-redux";
import Spinner from "../spinner/spinner";
import { getLocalTimeFormat } from '../../common/utils';

class LastTriggerCellRenderer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            lastTrigger: '‐ ‐ ‐ ‐ ‐ ‐ ‐ ‐ ‐',
            cell: {
                row: props.data,
                col: props.colDef.headerName
            }
        };
    }

    componentDidMount() {
        if (this.props.data.DeviceCount !== undefined) {
            if (this.props.data.DeviceCount === 0) {
                this.setState({loading: false});
            } else {
                ApiService.getAlarmListByRule(
                    this.state.cell.row.Id,
                    {
                        order: 'desc',
                        limit: 1,
                        devices: this.props.data.Devices.map(device => device.Id).toString()
                    }
                ).then(response => {
                    if (response.Items && response.Items.length) {
                        this.setState(
                            {
                                loading: false,
                                lastTrigger: getLocalTimeFormat(response.Items[0].DateCreated)
                            }
                        );
                    }
                    this.setState({loading: false});
                }).catch(err => {
                    console.log(err);
                    this.setState({loading: false});
                })
            }
        }
    }

    render() {
        return (
            this.state.loading
                ? <Spinner size="small" pattern="bar"/>
                : <div> {this.state.lastTrigger} </div>
        )
    }
}

const mapStateToProps = state => ({
    deviceGroups: state.filterReducer.deviceGroups
});

export default connect(mapStateToProps, null)(LastTriggerCellRenderer);
