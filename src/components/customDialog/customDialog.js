// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Grid, Row, Col, Modal, Button } from 'react-bootstrap';
import Http from '../../common/httpClient';
import Config from '../../common/config';
import CustomInfo from '../customInfo/customInfo';
import CustomLogo from '../customLogo/customLogo';
import CustomDevice from '../customDevice/customDevice';

export default class CustomFlyout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            step: 1,
            demo: false
        };
    }

    componentDidMount() {
        Http.get(Config.uiConfigApiUrl + "/api/v1/solution/init").then((result) => {
            if (!result) {
                this.show();
            }
        });
    }

    show() {
        this.setState({
            show: true,
            step: 1,
            demo: false
        });
    }

    hide() {
        this.setState({
            show: false
        });
    }

    createHandler = () => {
        if (this.state.step === 1) {
            this.setState({
                step: 2
            });
        }
        else {
            const task1 = this.refs.customInfo.submit();
            const task2 = this.refs.customLogo.submit();
            const task3 = this.refs.customDevice.submit(this.state.demo);
            Promise.all([task1, task2, task3]).then(() => {
                this.hide();
            });
        }
    }

    cancelHandler = () => {
        this.hide()
    }

    demoClickHandler = (e) => {
        this.setState({
            demo: e.target.checked
        });
    }

    render() {
        return (
            <div>
                <Modal show={this.state.show} onHide={this.close} >
                    <Modal.Header>
                        <Modal.Title>Customize Your Solution</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ display: this.state.step === 1 ? '' : 'none' }}>
                            <label><input type="checkbox" checked={this.state.demo} onChange={this.demoClickHandler} />&nbsp;Provision the default demo experience</label><p />
                            <Grid fluid ref="grid">
                                <Row>
                                    <Col md={6}><CustomInfo ref="customInfo" /></Col>
                                    <Col md={6}><CustomLogo ref="customLogo" /></Col>
                                </Row>
                                <Row>
                                    <Col md={12}><CustomDevice ref="customDevice" disabled={this.state.demo} /></Col>
                                </Row>
                            </Grid>
                        </div>
                        <div style={{ display: this.state.step === 2 ? '' : 'none' }}>
                            <div>We will create the simulated devices experience for you.</div>
                            <p /><p />
                            <div>This should talke a few seconds.</div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.cancelHandler}>Cancel</Button>&nbsp;
                        <Button bsStyle="primary" onClick={this.createHandler}>Create</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
