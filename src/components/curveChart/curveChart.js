// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import EventTopic from '../../common/eventtopic';
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
            maxPointsNumber: 100,
            chartControl: ReactDOM.findDOMNode(this.refs.curveChart),
            legends: ReactDOM.findDOMNode(this.refs.curveLegends)
        });
        this.CurveChartGraph.init();
        this.renderChart();
    }

    componentWillUnmount() {
        this.CurveChartGraph.dispose();
        this.CurveChartGraph = null;
        EventTopic.unsubscribe(this.subscriptions);
    }

    renderChart() {
        if (this.props.deviceTopics) {
            this.handleEvent(this.updateTelemetryByDeviceId, this.props.deviceTopics);
        } else if (this.props.deviceGroupTopics) {
            this.handleEvent(this.updateTelemetryByGroupId, this.props.deviceGroupTopics);
        }
    }

    updateTelemetryByGroupId(deviceGroup, telemetries) {
        if (deviceGroup && deviceGroup.length > 0 && telemetries && telemetries.length > 0) {
            let url = `${Config.solutionApiUrl}api/v1/telemetry/devicegroup/`;
            this.CurveChartGraph.update(url, deviceGroup, telemetries);
        }
    }

    updateTelemetryByDeviceId(data) {
        let deviceId = data.Id;
        if (deviceId) {
            var url = `${Config.solutionApiUrl}api/v1/telemetry/device/`;
            this.CurveChartGraph.update(url, deviceId);
        }
    }

    handleEvent(fn, topics) {
        let args = new Array(topics.length);
        topics.forEach((item, index) => {
            this.subscriptions.push(EventTopic.subscribe(item, (topic, data, publisher) => {
                args[index] = data;
                fn.apply(this, args);
            }));
        });
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
