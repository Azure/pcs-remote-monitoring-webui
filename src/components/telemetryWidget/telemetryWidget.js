// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import Config from '../../common/config';
import { Topics } from '../../common/eventtopic';
import GenericDropDownList from '../../components/genericDropDownList/genericDropDownList';
import CurveChart from '../../components/curveChart/curveChart';

export default class TelemetryWidget extends React.Component {

    render() {
        return (
            <div style={{ height: '100%' }}>
                <div style={{ width: '10em', marginLeft: '1em', float: 'right' }}>
                    <div>
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

                    <div style={{ marginTop: '1em' }}>
                        <GenericDropDownList
                            id="TelemetryTypes"
                            menuAlign="right"
                            multipleSelect={ true }
                            requestUrl={Config.telemetryTypeApiUrl}
                            initialState={{
                                defaultText: 'Telemetry',
                                selectFirstItem: true,
                                keepLastSelection: true
                            }}
                            selectAll={{
                                text: 'Select All'
                            }}
                            publishTopic={Topics.dashboard.telemetryType.selected}
                            reloadRequestTopic={Topics.dashboard.deviceGroup.selected}>
                        </GenericDropDownList>
                    </div>
                </div>
                <div style={{ width: 'auto', height: '100%', float: 'none', overflow: 'hidden' }}>
                    <CurveChart deviceGroupTopics={[Topics.dashboard.deviceGroup.selected, Topics.dashboard.telemetryType.selected]}></CurveChart>
                </div>
            </div>
        );
    }
}
