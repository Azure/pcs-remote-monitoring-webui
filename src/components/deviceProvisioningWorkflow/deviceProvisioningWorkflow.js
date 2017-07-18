// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import Config from '../../common/config';
import Http from '../../common/httpClient';
import { DropdownButton, MenuItem, FormGroup, ButtonGroup, Button, FormControl, Checkbox } from 'react-bootstrap';
import './deviceProvisioningWorkflow.css';


class DeviceProvisioningWorkflow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prvisionMethod: "undetermined",
            generateDeviceId: false,
            generateDeviceKey: false,
            simulatedDevice: true,
            simulatedTypes: [],
            selectedSimulatedType: null,
            authenticationType: "symmetricKey",
            enrollment: "individual"
        };
        this.tokens = [];
    }

    componentDidMount() {
        this.getSimulatedTypes();
    }

    getSimulatedTypes() {
        Http.get(`${Config.solutionApiUrl}api/v1/simulateddevice/types`).then((data) => {
            this.setState({ simulatedTypes: data });
        });
    }

    onClickManual = () => {
        this.setState({ provisionMethod: "manual" });
    }

    onClickAutomatic = () => {
        this.setState({ provisionMethod: "automatic" });
    }

    onClickGenerateDeviceId = () => {
        this.setState({ generateDeviceId: !this.state.generateDeviceId });
    }

    onClickGenerateDeviceKey = () => {
        this.setState({ generateDeviceKey: !this.state.generateDeviceKey });
    }

    onClickSimulatedDevice = () => {
        this.setState({ simulatedDevice: !this.state.simulatedDevice });
    }

    onClickSimulatedType = (eventKey) => {
        this.setState({ selectedSimulatedType: eventKey });
    }

    onClickSymmetricKey = () => {
        this.setState({ authenticationType: "symmetricKey" });
    }

    onClickX509 = () => {
        this.setState({ authenticationType: "X509" });
    }

    onClickCreateDevice = () => {
        console.log("CreateDevice");
        if (typeof this.props.finishCallback === "function") {
            this.props.finishCallback();
        }
    }

    onClickIndividual = () => {
        this.setState({ enrollment: "individual" });
    }

    onClickGroup = () => {
        this.setState({ enrollment: "group" });
    }

    isValid = () => {
        if (this.state.provisionMethod === "manual") {
            if (this.state.simulatedDevice) {
                return this.state.selectedSimulatedType;
            }
        }

        return true;
    }

    renderSimulatedSection() {
        return (
            <div style={{ display: this.state.simulatedDevice ? "block" : "none" }}>
                <h5>Device Types<br />Select an existing device type</h5>
                <DropdownButton disabled={this.state.simulatedTypes.length === 0} title={this.state.selectedSimulatedType || "Chiller device type"}>
                    {this.state.simulatedTypes.map((t) => {
                        return <MenuItem eventKey={t} onSelect={this.onClickSimulatedType}>{t}</MenuItem>
                    })}
                </DropdownButton>
            </div>
        );
    }

    renderPhysicalSection() {
        return (
            <div style={{ display: this.state.simulatedDevice ? "none" : "block" }} >
                <h5>Authentication type</h5>
                <FormGroup>
                    <ButtonGroup>
                        <Button active={this.state.authenticationType === "symmetricKey" ? " active" : ""}
                            onClick={this.onClickSymmetricKey}>Symmetric Key</Button>
                        <Button active={this.state.authenticationType === "X509" ? " active" : ""}
                            onClick={this.onClickX509}>X.509</Button>
                    </ButtonGroup>
                </FormGroup>

                <div style={{ display: this.state.authenticationType === "symmetricKey" ? "block" : "none" }} >
                    <h5>Primary Key</h5>
                    <FormGroup>
                        <FormControl type="text" id="edtPrimaryKey" disabled={this.state.generateDeviceKey} />
                    </FormGroup>

                    <h5>Secondary Key</h5>
                    <FormGroup>
                        <FormControl type="text" id="edtSecondaryKey" disabled={this.state.generateDeviceKey} />
                    </FormGroup>

                    <FormGroup>
                        <Checkbox inline checked={this.state.generateDeviceKey} onClick={this.onClickGenerateDeviceKey}>
                            Auto Generate Keys
                        </Checkbox>
                    </FormGroup>
                </div>

                <div style={{ display: this.state.authenticationType === "X509" ? "block" : "none" }}>
                    <h5>Primary thumbprint</h5>
                    <FormGroup>
                        <FormControl type="text" id="edtPrimaryThumbprint" />
                    </FormGroup>
                    <h5>Secondary thumbprint</h5>
                    <FormGroup>
                        <FormControl type="text" id="edtSecondaryThumbprint" />
                    </FormGroup>
                </div>
            </div>
        );
    }

    renderManualSection() {
        return (
            <div style={{ display: this.state.provisionMethod === "manual" ? "block" : "none" }}>
                <FormGroup>
                    <Checkbox inline checked={this.state.simulatedDevice} onClick={this.onClickSimulatedDevice}>
                        Simulated devices(s)
                         </Checkbox>
                </FormGroup>

                <FormGroup style={{ display: this.state.simulatedDevice ? "block" : "none" }}>
                    <h5>Number of devices</h5>
                    <FormControl type="text" id="edtTotalDevices" />
                </FormGroup>

                <h5>Device ID</h5>
                <FormGroup>
                    <FormControl type="text" id="edtDeviceID" disabled={this.state.generateDeviceId} />
                </FormGroup>

                <FormGroup>
                    <Checkbox inline check={this.state.generateDeviceId} onClick={this.onClickGenerateDeviceId} >
                        Generate an ID for me
                         </Checkbox>
                </FormGroup>

                {this.renderSimulatedSection()}

                {this.renderPhysicalSection()}
            </div>
        );
    }

    renderAutomaticSection() {
        return (
            <div style={{ display: this.state.provisionMethod === "automatic" ? "block" : "none" }}>
                <FormGroup>
                    <h5>DPS Tenant</h5>
                    <DropdownButton title="New Tenant">
                        <MenuItem eventKey="New Tenant">New Tenant</MenuItem>
                    </DropdownButton>
                </FormGroup>

                <h5>Enrollment</h5>
                <FormGroup>
                    <ButtonGroup>
                        <Button active={this.state.enrollment === "individual" ? " active" : ""}
                            onClick={this.onClickIndividual}>Individual</Button>
                        <Button active={this.state.enrollment === "group" ? " active" : ""}
                            onClick={this.onClickGroup}>  Group</Button>
                    </ButtonGroup>
                </FormGroup>

                <div style={{ display: this.state.enrollment === "individual" ? "block" : "none" }}>
                    <FormGroup>
                        <h5>Device ID</h5>
                        <FormControl type="text" id="edtDPSDeviceID" />
                    </FormGroup>
                </div>

                <div style={{ display: this.state.enrollment === "group" ? "block" : "none" }}>
                    <h5>Group Name</h5>
                    <FormGroup>
                        <FormControl type="text" id="edtDPSGroupName" />
                    </FormGroup>

                    <h5>Secure storage type</h5>
                    <FormGroup>
                        <FormControl type="text" id="edtDPSStorageType" />
                    </FormGroup>

                    <h5>Relevant storage info</h5>
                    <FormGroup>
                        <FormControl type="text" id="edtDPSStorageInfo" />
                    </FormGroup>
                </div>

                <h5>Device configuration</h5>
                <FormGroup>
                    <FormControl type="text" id="edtDPSDeviceConfiguration" />
                </FormGroup>

                <h5>Device organization</h5>
                <FormGroup>
                    <FormControl type="text" id="edtDPSDeviceOrganization" />
                </FormGroup>

                <div style={{ display: this.state.enrollment === "group" ? "block" : "none" }}>
                    <h5>Number of devices</h5>
                    <FormGroup>
                        <FormControl type="text" id="edtDPSTotalDevices" />
                    </FormGroup>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div style={{ margin: "5px" }}>
                <div>
                    <h5 style={{ marginBottom: "2ex" }}>Select your provisioning method</h5>
                    <Button style={{ width: "40%" }} onClick={this.onClickManual}>Manual</Button>
                    <Button style={{ width: "40%", float: "right" }} onClick={this.onClickAutomatic}>Automatic</Button>
                </div>

                {this.renderManualSection()}

                {this.renderAutomaticSection()}

                <div style={{ display: (this.state.provisionMethod === "manual" || this.state.provisionMethod === "automatic") ? "block" : "none" }}>
                    <Button style={{ float: "right" }} onClick={this.onClickCreateDevice}
                        disabled={!this.isValid()}> Create device</Button>
                </div>
            </div>
        );
    }
}

export default DeviceProvisioningWorkflow;
