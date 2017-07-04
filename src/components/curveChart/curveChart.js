// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import EventTopic, { Topics } from '../../common/eventtopic';
import Config from '../../common/config';
import CurveChartGraph from './curveChartGraph';
import "./curveChart.css";

class CurveChart extends Component {
    constructor(props) {
        super(props);
        this.subscriptions = [];
    }

    componentDidMount() {
        this.CurveChartGraph = new CurveChartGraph({
            loadDataUrlBase: '',
            refreshMilliseconds: 3000,
            maxPointsNumber: 20,
            chartControl: ReactDOM.findDOMNode(this.refs.curveChart),
            legends: ReactDOM.findDOMNode(this.refs.curveLegends)
        });
        this.CurveChartGraph.init();

        let topics = [Topics.system.dashboard.deviceGroup.selectionChanged, Topics.system.dashboard.telemetry.selectionChanged];
        this.handleDropdownEvent(this.updateTelemetryByGroupId, this, topics)();
    }

    componentWillUnmount() {
        this.CurveChartGraph.dispose();
        this.CurveChartGraph = null;
        EventTopic.unsubscribe(this.subscriptions);
    }

    updateTelemetryByGroupId(deviceGroup, telemetries) {
        if (deviceGroup.length > 0 && telemetries && telemetries.length > 0) {
            var url = `${Config.solutionApiUrl}api/v1/telemetry/devicegroup/`;
            this.CurveChartGraph.update(url, deviceGroup, telemetries);
        }
    }

    updateTelemetryByDeviceId(deviceId) {
        if (deviceId) {
            var url = `${Config.solutionApiUrl}api/v1/telemetry/device/`;
            this.CurveChartGraph.update(url, deviceId);
        }
    }

    handleDropdownEvent(fn, scope, topics) {
        var args = new Array(topics.length);
        return function () {
            topics.forEach((item, index) => {
                ((i) => {
                    scope.subscriptions.push(EventTopic.subscribe(item, (topic, data, publisher) => {
                        args[i] = data;
                        fn.apply(scope, args);
                    }));
                })(index);
            });
        }
    }

    render() {
        return (
            <div className="curveChart">
                <div ref="curveLegends">
                </div>
                <div className="curveCanvas">
                    <canvas ref="curveChart" ></canvas>
                </div>
            </div>
        );
    }
}

export default CurveChart;
