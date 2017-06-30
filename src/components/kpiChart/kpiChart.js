// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PieChartGraph from './pieChartGraph';
import Config from '../../common/config';
import Http from '../../common/httpClient';
import './kpiChart.css';

class KpiChart extends Component {
    constructor(props) {
        super(props);
        this.PieChartGraph = new PieChartGraph();

    }

    componentDidMount() {
        this.pieSettings = {
            chartControl: ReactDOM.findDOMNode(this.refs.kpiChartArea)
        };
        this.PieChartGraph.init(this.pieSettings);
        this.getKPI();
    }

    componentWillUnmount() {
        this.PieChartGraph = null;
    }

    getKPI = function () {
        Http.get(`${Config.solutionApiUrl}/api/v1/kpi/type/${this.props.title}?r=${Math.random()}`).then((data) => {
            this.PieChartGraph.update(data);
        });
    }

    render() {
        return (
            <div className="kpiChart">
                <div className="kpiChartTitle"><label>{this.props.title}</label></div>
                <div className="kpiChartArea">
                    <canvas ref="kpiChartArea" />
                </div>
            </div>
        );
    }
}

export default KpiChart;
