// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import RulesActionsList from '../../components/rulesActionsList/rulesActionsList';

import '../layout.css';

class Devices extends Component {
    render() {
        return (
            <Grid fluid className="layout">
                <Row className="widgets rowH100Percent">
                    <Col md={12}><RulesActionsList/></Col>
                </Row>
            </Grid>
        );
    }
}

export default Devices;