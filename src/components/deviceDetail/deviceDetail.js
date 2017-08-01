
import React from 'react';
import EventTopic, { Topics } from "../../common/eventtopic";
import Flyout, { Header, Body } from '../../framework/flyout/flyout';
import SearchableDataGrid from '../../framework/searchableDataGrid/searchableDataGrid';
import JsonViewer from '../jsonViewer/jsonViewer';
import CurveChart from '../curveChart/curveChart';
import lang from '../../common/lang';

import './deviceDetail.css';

class DeviceDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            twin: props.twin || null,
            maxNumberOfProperties: props.maxNumberOfProperties || 10
        };
        this.subscriptions = [];
    }

    componentDidMount() {
        this.subscriptions.push(EventTopic.subscribe(Topics.device.selected, (topic, data, publisher) => {
            this.setState({
                twin: data.Twin,
                diagnostics: [
                    { Key: lang.DEVICES.CONNECTED, Value: data.Connected },
                    { Key: lang.DEVICES.ENABLED, Value: data.Enabled },
                    { Key: lang.DEVICES.LASTACTIVITYTIME, Value: data.LastActivity },
                    { Key: lang.DEVICES.LASTSTATUSUPDATEDTIME, Value: data.LastStatusUpdated }
                ]
            });
        }));
    }

    componentWillUnmount() {
        EventTopic.unsubscribe(this.subscriptions);
    }

    onViewRawTwin = () => {
        this.refs.jsonEditorFlyout.show();
    }

    onDiagnostics = () => {
        this.refs.diagnosticFlyout.show();
    }

    render() {
        const twin = this.state.twin;
        let deviceId, methods, properties;

        if (twin) {
            const methodPrefix = /^([^-]*)(--.*)?$/;
            deviceId = twin.DeviceId;
            methods = twin.reportedProperties.SupportedMethods ?
                Object.keys(twin.reportedProperties.SupportedMethods)
                    .map(m => {
                        return (
                            <li key={m}>{m.match(methodPrefix)[1]}</li>
                        )
                    }) : null;
            const propertyDefs = [
                {
                    text: lang.DEVICES.FIRMWAREVERSION,
                    value: twin.reportedProperties ? twin.reportedProperties.FirmwareVersion : null
                },
                {
                    text: lang.DEVICES.MANUFACTURER,
                    value: twin.reportedProperties ? twin.reportedProperties.Manufacturer : null
                }
            ];
            properties = propertyDefs.map(p =>
                <tr key={p.text}><td><span title={p.text}>{p.text}</span></td><td title={p.value} style={{ padding: "4px" }}>{p.value}</td></tr>
            );
        }
        return (
            <div className="deviceDetailTile">
                <div>
                    <label>
                        {deviceId}
                    </label>
                </div>
                <div className="deviceDetailType">
                    <span className="deviceDetailTypeLabel">Type</span><span>Prototyping device</span>
                </div>
                <div className="deviceDetailSection">
                    <div className="deviceDetailSectionLabel">Sensors</div>
                    <ul className="deviceDetailSectionList">
                        <li>Temperature</li>
                        <li>Humidity</li>
                        <li>Vibration</li>
                    </ul>
                </div>
                <div className="deviceDetailCurveChart">
                    <CurveChart deviceTopics={[Topics.device.selected]} />
                </div>
                <div className="deviceDetailSection">
                    <div className="deviceDetailSectionLabel">Methods</div>
                    <ul className="deviceDetailSectionList">{methods}</ul>
                </div>
                <div className="deviceDetailSection">
                    <table className="deviceDetailTable">
                        <thead><tr><td>Properties</td><td>Value</td></tr></thead>
                        <tbody>{properties}</tbody>
                    </table>
                </div>
                <div className="deviceDetailButtons">
                    <a href="#rawtwin" onClick={this.onViewRawTwin}><p>View raw device twin</p></a>
                    <button className="btn btn-default" onClick={this.onDiagnostics}>Diagnostics</button>
                </div>
                <Flyout ref="jsonEditorFlyout">
                    <Header>
                        Device Twin
                    </Header>
                    <Body>
                        <JsonViewer data={this.state.twin} />
                    </Body>
                </Flyout>
                <Flyout ref="diagnosticFlyout">
                    <Header>
                        Device Diagnostics
                    </Header>
                    <Body>
                        <SearchableDataGrid
                            title=""
                            rowData={this.state.diagnostics}
                            columnDefs={[
                                { headerName: "Parameter", field: "Key", filter: "text" },
                                { headerName: "Value", field: "Value", filter: "text" }
                            ]}
                            height={300}
                            pagination={false}
                            multiSelect={false}
                            enableSearch={false}
                            showLastUpdate={false}
                        ></SearchableDataGrid>
                        <div style={{ "marginTop": "10px" }}>
                            <button className="btn btn-default" onClick={() => this.refs.diagnosticFlyout.hide()}>Cancel</button>
                        </div>
                    </Body>
                </Flyout>
            </div>
        );
    }
}

export default DeviceDetail;
