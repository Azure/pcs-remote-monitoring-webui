// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Config from '../../common/config';
import EventTopic, { Topics } from '../../common/eventtopic';
import SearchableDataGrid from '../../framework/searchableDataGrid/searchableDataGrid';
import GenericDropDownList from '../../components/genericDropDownList/genericDropDownList';
import Flyout, { Header, Body } from '../../framework/flyout/flyout';
import DeviceDetail from '../deviceDetail/deviceDetail';
import AddDevice from '../addDevice/addDevice';
import ActOnDevice from '../actOnDevice/actOnDevice';

import './deviceList.css';

export default class DeviceList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [
                { headerName: "DeviceId", field: "DeviceId", filter: "text" },
                { headerName: "Type", field: "tags.deviceType", filter: "text" },
                { headerName: "Firmware Version", field: "reported.System.FirmwareVersion", filter: "text" },
                { headerName: "Manufacturer", field: "reported.System.Manufacturer", filter: "text" },
                { headerName: "ModelNumber", field: "reported.System.ModelNumber", filter: "text" },
                { headerName: "State", field: "tags.HubEnabledState", filter: "text" },
                { headerName: "Location", field: "tags.location", filter: "text" },
                { headerName: "Building", field: "tags.Building", filter: "text" }
            ]
        };
    }

    onDataChanged = () => {
        this.refs.grid.selectAll();
    }

    onRowClick = (row) => {
        setTimeout(() => {
            this.refs.flyout.show();
            EventTopic.publish(Topics.device.selected, row, this);
        });
    }

    onRowSelectionChanged = (rows) => {
        this.setState({
            devices: rows
        });
    }

    render() {
        return (
            <div ref="container" className="deviceListContainer">
                <div className="deviceListButtonBar">
                    <div className="deviceListButton">
                        <GenericDropDownList
                            id="DeviceGroups"
                            menuAlign="right"
                            requestUrl={Config.deviceGroupApiUrl}
                            initialState={{
                                defaultText: 'Choose devices'
                            }}
                            newItem={{
                                text: '(new group)',
                                dialog: 'deviceGroupEditor'
                            }}
                            publishTopic={Topics.dashboard.deviceGroup.selected}
                            reloadRequestTopic={Topics.dashboard.deviceGroup.changed}>
                        </GenericDropDownList>
                    </div>
                    <div className="deviceListButton">
                        <ActOnDevice ref="actOnDevice" buttonText="Act on devices" devices={this.state.devices}/>
                    </div>
                    <div className="deviceListButton">
                        <AddDevice />
                    </div>
                </div>
                <SearchableDataGrid
                    ref="grid"
                    datasource={`${Config.solutionApiUrl}api/v1/devicegroups/{group}/devices/flattentwin`}
                    multiSelect={true}
                    title=""
                    showLastUpdate={true}
                    urlSearchPattern="/\{group\}/i"
                    eventDataKey="0"
                    enableSearch={true}
                    autoLoad={true}
                    topics={
                        [
                            Topics.dashboard.deviceGroup.selected
                        ]
                    }
                    columnDefs={this.state.columnDefs}
                    suppressFieldDotNotation={true}
                    onRowSelectionChanged={this.onRowSelectionChanged}
                    onRowClicked={this.onRowClick}
                    onGridReady={this.onDataChanged}
                    onRowDataChanged={this.onDataChanged}
                >
                </SearchableDataGrid>
                <Flyout ref='flyout'>
                    <Header>
                        Device Detail
                    </Header>
                    <Body>
                        <DeviceDetail />
                    </Body>
                </Flyout>
            </div>
        );
    }
}
