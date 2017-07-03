// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import KpiChart from '../kpiChart/kpiChart';
import AlarmCounter from '../alarmCounter/alarmCounter';
import { Grid, Row, Col } from 'react-bootstrap';
import './kpiWidget.css'

class KpiWidget extends Component {
    render() {
        return (
            <Grid fluid className="kpiWidget">
                <Row className="kpiTitleRow"><Col md={12}><h4>System KPIs</h4></Col></Row>
                <Row className="kpiRow">
                    <Col md={4}><AlarmCounter title="Open Alarms" url="api/v1/alarm/P1D/count/Open" color="#FFFFFF" backgroundColor="#FF0000" fontSize="60"></AlarmCounter></Col>
                    <Col md={4}><KpiChart title="Type"></KpiChart></Col>
                    <Col md={4}><KpiChart title="Factory"></KpiChart></Col>
                </Row>
                <Row className="kpiRow">
                    <Col md={4}><KpiChart title="Connectivity"></KpiChart></Col>
                    <Col md={4}><KpiChart title="Firmware"></KpiChart></Col>
                </Row>
            </Grid>
        );
    }
}

export default KpiWidget;
