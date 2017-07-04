// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Config from "../../common/config";
import { Topics } from '../../common/eventtopic';
import GenericDropDownList from '../../components/genericDropDownList/genericDropDownList';
import CurveChart from '../../components/curveChart/curveChart';


class TelemetryWidget extends Component {

    render() {
        return (
            <div style={{height: "100%"}}>                
                <div style={{width: "10em", marginLeft: "1em", float: "right"}}>
                    <div>
                        <GenericDropDownList
                            id="DeviceGroups"
                            menuAlign="right"
                            requestUrl={Config.deviceGroupApiUrl}
                            initialState={{
                                "defaultText": "Choose devices"
                            }}
                            newItem={{
                                "text": "(new group)",
                                "dialog": "deviceGroupEditor"
                            }}
                            publishTopic={Topics.system.dashboard.deviceGroup.selectionChanged}
                            reloadRequestTopic={Topics.system.dashboard.deviceGroup.changed}>
                        </GenericDropDownList>
                    </div>

                    <div style={{marginTop: "1em"}}>
                        <GenericDropDownList                            
                            id="TelemetryTypes"
                            menuAlign="right"
                            multipleSelect={ true }
                            requestUrl={Config.telemetryTypeApiUrl}
                            initialState={{
                                "defaultText": "Telemetry",
                                "selectFirstItem": true,
                                "keepLastSelection": true
                            }}
                            selectAll={{
                                "text": "Select All"
                            }}
                            publishTopic={Topics.system.dashboard.telemetry.selectionChanged}
                            reloadRequestTopic={Topics.system.dashboard.deviceGroup.selectionChanged}>
                        </GenericDropDownList>
                    </div>
                </div>
                <div style={{width: "auto", height: "100%", float: "none", overflow: "hidden"}}>
                    <CurveChart></CurveChart>
                </div>
            </div>
        );
    }
}

export default TelemetryWidget;