import React from 'react';
import Config from '../../common/config';
import EventTopic, { Topics } from "../../common/eventtopic";
import Http from '../../common/httpClient';
import Flyout from '../../framework/flyout/flyout';
import SearchableDataGrid from '../../framework/searchableDataGrid/searchableDataGrid';
import JsonViewer from '../jsonViewer/jsonViewer';
import CurveChart from '../curveChart/curveChart';

import './deviceDetail.css';

class DeviceDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            twin: props.twin || [],
            maxNumberOfProperties: props.maxNumberOfProperties || 10
        };
        this.subscriptions = [];
    }

    componentDidMount() {
        this.subscriptions.push(EventTopic.subscribe(Topics.system.device.selected, (topic, data, publisher) => {
            this.setState({ twin: data});
            this.refs.curveChart.updateTelemetryByDeviceId(data.DeviceId);
        }));
    }

    componentWillUnmount() {
        EventTopic.unsubscribe(this.subscriptions);
    }

    onViewRawTwin = () => {
        this.refs.jsonEditorFlyout.show();
        Http.get(Config.iotHubManagerApiUrl + "/api/v1/rawtwin/" + this.state.twin.DeviceId)
            .then(function(data) {
                EventTopic.publish(Topics.system.device.twin.opened, data, this);
            });
    }

    onDiagnostics = () => {
        EventTopic.publish(Topics.system.device.diagnose, {deviceId: this.state.twin.DeviceId}, this)
        this.refs.diagnosticFlyout.show();
    }

    render() {
        const twin = this.state.twin;
        const methodPrefix = /^reported\.SupportedMethods\.([^-]*)(--.*)?$/;
        const methods = Object.keys(twin)
            .filter(m => methodPrefix.test(m))
            .map(m => {
                return (
                    <li>{m.match(methodPrefix)[1]}</li>
                )
            });
        const properties = Object.keys(twin).filter(p => !methodPrefix.test(p))
            .slice(0, this.state.maxNumberOfProperties)
            .map(p =>
                <tr><td><span title={p}>{p}</span></td><td style={{ padding: "4px" } }>{twin[p]}</td></tr>
            );

        return (
            <div className="deviceDetail-tile">
                <div className="deviceDetail-type">
                    <span className="deviceDetail-type-label">Type</span><span>Prototyping device</span>
                </div>
                <div className="deviceDetail-section">
                    <p className="deviceDetail-section-label">Sensors</p>
                    <ul className="deviceDetail-section-list">
                        <li>Temperature</li>
                        <li>Humidity</li>
                        <li>Vibration</li>
                    </ul>
                </div>
                <div className="deviceDetail-curve-chart">
                    <CurveChart ref="curveChart"/>
                </div>
                <div className="deviceDetail-section">
                    <p className="deviceDetail-section-label">Methods</p>
                    <ul className="deviceDetail-section-list">{methods}</ul>
                </div>
                <div className="deviceDetail-section">
                    <table className="deviceDetail-tabel">
                        <thead><tr><td>Properties</td><td>Value</td></tr></thead>
                        <tbody>{properties}</tbody>
                    </table>
                </div>
                <div className="deviceDetail-buttons">
                    <a href="#rawtwin" onClick={this.onViewRawTwin}><p>View raw device twin</p></a>
                    <button className="btn btn-default" onClick={this.onDiagnostics}>Diagnostics</button>
                </div>
                 <Flyout ref="jsonEditorFlyout">
                    <JsonViewer />
                 </Flyout>
                 <Flyout ref="diagnosticFlyout">
                    <SearchableDataGrid
                        title="Diagnostics"
                        datasource={`${Config.solutionApiUrl}api/v1/diagnostics/{deviceId}`}
                        urlSearchPattern="/\{deviceId\}/i"
                        topics={["system.device.diagnose"]}
                        eventDataKey="deviceId"
                        columns="Parameter:Key, Value:Value"
                        multiSelect={false}
                        enableSearch={false}
                        showLastUpdate={false}
                    />
                    <div style={{"marginTop": "10px"}}>
                        <button className="btn btn-default" onClick={() => this.refs.diagnosticFlyout.hide()}>Cancel</button>
                    </div>
                </Flyout>
            </div>
        );
    }
}

export default DeviceDetail;
