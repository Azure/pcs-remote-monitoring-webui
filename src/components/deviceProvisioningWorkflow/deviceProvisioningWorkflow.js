// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import Config from '../../common/config';
import Http from '../../common/httpClient';
import {
  DropdownButton,
  MenuItem,
  FormGroup,
  ButtonGroup,
  Button,
  FormControl,
  Checkbox
} from 'react-bootstrap';
import lang from '../../common/lang';

import './deviceProvisioningWorkflow.css';

class DeviceProvisioningWorkflow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prvisionMethod: 'undetermined',
      generateDeviceId: false,
      generateDeviceKey: false,
      simulatedDevice: true,
      simulatedTypes: [],
      selectedSimulatedType: null,
      authenticationType: 'symmetricKey',
      enrollment: 'individual',
      data: {
        device: {
          id: ''
        },
        simulation: {
          id: '',
          count: 0
        }
      }
    };
    this.tokens = [];
  }

  componentDidMount() {
    this.getSimulatedTypes();
  }

  getSimulatedTypes() {
    Http.get(`${Config.deviceSimulationApiUrl}devicemodels`).then(data => {
      this.setState({ simulatedTypes: data.Items });
    });
  }

  onClickManual = () => {
    this.setState({ provisionMethod: 'manual' });
  };

  onClickAutomatic = () => {
    this.setState({ provisionMethod: 'automatic' });
  };

  onClickGenerateDeviceId = () => {
    this.setState({ generateDeviceId: !this.state.generateDeviceId });
  };

  onClickGenerateDeviceKey = () => {
    this.setState({ generateDeviceKey: !this.state.generateDeviceKey });
  };

  onClickSimulatedDevice = () => {
    this.setState({ simulatedDevice: !this.state.simulatedDevice });
  };

  onClickSimulatedType = eventKey => {
    const data = this.state.data;
    data.simulation.id = eventKey;
    this.setState({ data: data });
    this.setState({ selectedSimulatedType: eventKey });
  };

  onClickSymmetricKey = () => {
    this.setState({ authenticationType: 'symmetricKey' });
  };

  onClickX509 = () => {
    this.setState({ authenticationType: 'X509' });
  };

  onClickCreateDevice = () => {
    if (typeof this.props.finishCallback === 'function') {
      this.props.finishCallback();
    }
    if (this.state.provisionMethod === 'manual') {
      if (this.state.simulatedDevice) {
        this.updateSimulation();
      } else {
        this.createDevice();
      }
    }
  };

  createDevice = () => {
    Http.post(
      `${Config.iotHubManagerApiUrl}devices`,
      this.state.data.device
    ).catch(err => {
      console.log(err);
    });
  };

  updateSimulation = () => {
    const id = '08a9e68c-9f4f-4456-8bb7-51178f437c41';
    const deviceSimulationPath = 'simulations';
    Http.get(`${Config.deviceSimulationApiUrl}${deviceSimulationPath}`)
      .then(data => {
        if (data.Items.length > 0) {
          const item = data.Items[0]; //todo: there is only one item currently
          let deviceTypes = item.DeviceTypes.filter((item, i) => {
            return item.Id === this.state.data.simulation.id;
          });
          if (deviceTypes.length > 0) {
            deviceTypes[0].Count += this.state.data.simulation.count;
          } else {
            item.DeviceTypes.push(this.state.data.simulation);
          }
          return item;
        } else {
          return {
            Etag: '',
            Id: id,
            Enabled: true,
            DeviceTypes: [this.state.data.simulation]
          };
        }
      })
      .then(data => {
        return Http.put(
          `${Config.deviceSimulationApiUrl}${deviceSimulationPath}/${id}`,
          data
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  onDeviceIdChange = event => {
    const data = this.state.data;
    data.device.Id = event.target.value;
    this.setState({ data: data });
  };

  onDeviceNumberChange = event => {
    const data = this.state.data;
    data.simulation.count = parseInt(event.target.value, 10);
    this.setState({ data: data });
  };

  onClickIndividual = () => {
    this.setState({ enrollment: 'individual' });
  };

  onClickGroup = () => {
    this.setState({ enrollment: 'group' });
  };

  isValid = () => {
    if (this.state.provisionMethod === 'manual') {
      if (this.state.simulatedDevice) {
        return this.state.selectedSimulatedType;
      }
    }

    return true;
  };

  renderSimulatedSection() {
    return (
      <div style={{ display: this.state.simulatedDevice ? 'block' : 'none' }}>
        <h5>
          {lang.DEVICES.DEVICETYPES}
          <br />
          {lang.DEVICES.SELECTTYPE}
        </h5>
        <DropdownButton
          id="dgDeviceTypes"
          disabled={this.state.simulatedTypes.length === 0}
          title={this.state.selectedSimulatedType || 'Chiller device type'}
        >
          {this.state.simulatedTypes.map((t, index) => {
            return (
              <MenuItem
                key={index}
                eventKey={t.Name}
                onSelect={this.onClickSimulatedType}
              >
                {t.Name}
              </MenuItem>
            );
          })}
        </DropdownButton>
      </div>
    );
  }

  renderPhysicalSection() {
    return (
      <div style={{ display: this.state.simulatedDevice ? 'none' : 'block' }}>
        <h5>
          {lang.DEVICES.AUTHENTICATIONTYPE}
        </h5>
        <FormGroup>
          <ButtonGroup>
            <Button
              active={
                this.state.authenticationType === 'symmetricKey' ? true : false
              }
              onClick={this.onClickSymmetricKey}
            >
              {lang.DEVICES.SYMMETRICKEY}
            </Button>
            <Button
              active={this.state.authenticationType === 'X509' ? true : false}
              onClick={this.onClickX509}
            >
              {lang.DEVICES.X509}
            </Button>
          </ButtonGroup>
        </FormGroup>

        <div
          style={{
            display:
              this.state.authenticationType === 'symmetricKey'
                ? 'block'
                : 'none'
          }}
        >
          <h5>
            {lang.DEVICES.PRIMARYKEY}
          </h5>
          <FormGroup>
            <FormControl
              type="text"
              id="edtPrimaryKey"
              disabled={this.state.generateDeviceKey}
            />
          </FormGroup>

          <h5>
            {lang.DEVICES.SECONDARYKEY}
          </h5>
          <FormGroup>
            <FormControl
              type="text"
              id="edtSecondaryKey"
              disabled={this.state.generateDeviceKey}
            />
          </FormGroup>

          <FormGroup>
            <Checkbox
              inline
              defaultChecked={this.state.generateDeviceKey}
              onClick={this.onClickGenerateDeviceKey}
            >
              {lang.DEVICES.AUTOGENERATEKEYS}
            </Checkbox>
          </FormGroup>
        </div>

        <div
          style={{
            display: this.state.authenticationType === 'X509' ? 'block' : 'none'
          }}
        >
          <h5>
            {' '}{lang.DEVICES.PRIMARYTHUMBPRINT}
          </h5>
          <FormGroup>
            <FormControl type="text" id="edtPrimaryThumbprint" />
          </FormGroup>
          <h5>
            {lang.DEVICES.SENCONDARYTHUMBPRINT}
          </h5>
          <FormGroup>
            <FormControl type="text" id="edtSecondaryThumbprint" />
          </FormGroup>
        </div>
      </div>
    );
  }

  renderManualSection() {
    return (
      <div
        style={{
          display: this.state.provisionMethod === 'manual' ? 'block' : 'none'
        }}
      >
        <FormGroup>
          <Checkbox
            inline
            defaultChecked={this.state.simulatedDevice}
            onClick={this.onClickSimulatedDevice}
          >
            {lang.DEVICES.SIMULATEDDEVICES}
          </Checkbox>
        </FormGroup>

        <FormGroup
          style={{ display: this.state.simulatedDevice ? 'block' : 'none' }}
        >
          <h5>
            {' '}{lang.DEVICES.NUMBEROFDEVICES}
          </h5>
          <FormControl
            type="text"
            id="edtTotalDevices"
            onChange={this.onDeviceNumberChange}
          />
        </FormGroup>

        <h5>
          {lang.DEVICES.NEWDEVICEID}
        </h5>
        <FormGroup>
          <FormControl
            type="text"
            id="edtDeviceID"
            disabled={this.state.generateDeviceId}
            onChange={this.onDeviceIdChange}
          />
        </FormGroup>

        <FormGroup>
          <Checkbox
            inline
            defaultChecked={this.state.generateDeviceId}
            onClick={this.onClickGenerateDeviceId}
          >
            {lang.DEVICES.GENERATEDEVICEID}
          </Checkbox>
        </FormGroup>

        {this.renderSimulatedSection()}

        {this.renderPhysicalSection()}
      </div>
    );
  }

  renderAutomaticSection() {
    return (
      <div
        style={{
          display: this.state.provisionMethod === 'automatic' ? 'block' : 'none'
        }}
      >
        <FormGroup>
          <h5>
            {' '}{lang.DEVICES.DPSTENANT}{' '}
          </h5>
          <DropdownButton title="New Tenant" id="dgTenant">
            <MenuItem eventKey="New Tenant">
              {lang.DEVICES.NEWTENANT}
            </MenuItem>
          </DropdownButton>
        </FormGroup>

        <h5>
          {lang.DEVICES.ENROLLMENT}
        </h5>
        <FormGroup>
          <ButtonGroup>
            <Button
              active={this.state.enrollment === 'individual' ? true : false}
              onClick={this.onClickIndividual}
            >
              {lang.DEVICES.INDIVIDUAL}
            </Button>
            <Button
              active={this.state.enrollment === 'group' ? true : false}
              onClick={this.onClickGroup}
            >
              {lang.DEVICES.GROUP}{' '}
            </Button>
          </ButtonGroup>
        </FormGroup>

        <div
          style={{
            display: this.state.enrollment === 'individual' ? 'block' : 'none'
          }}
        >
          <FormGroup>
            <h5>
              {lang.DEVICES.NEWDEVICEID}
            </h5>
            <FormControl type="text" id="edtDPSDeviceID" />
          </FormGroup>
        </div>

        <div
          style={{
            display: this.state.enrollment === 'group' ? 'block' : 'none'
          }}
        >
          <h5>
            {lang.DEVICES.GROUPNAME}
          </h5>
          <FormGroup>
            <FormControl type="text" id="edtDPSGroupName" />
          </FormGroup>

          <h5>
            {lang.DEVICES.SECURESTORAGETYPE}
          </h5>
          <FormGroup>
            <FormControl type="text" id="edtDPSStorageType" />
          </FormGroup>

          <h5>
            {lang.DEVICES.RELEVANTSTORAGEINFO}
          </h5>
          <FormGroup>
            <FormControl type="text" id="edtDPSStorageInfo" />
          </FormGroup>
        </div>

        <h5>
          {lang.DEVICES.DEVICECONFIGURATION}
        </h5>
        <FormGroup>
          <FormControl type="text" id="edtDPSDeviceConfiguration" />
        </FormGroup>

        <h5>
          {lang.DEVICES.DEVICEORGANIZATION}
        </h5>
        <FormGroup>
          <FormControl type="text" id="edtDPSDeviceOrganization" />
        </FormGroup>

        <div
          style={{
            display: this.state.enrollment === 'group' ? 'block' : 'none'
          }}
        >
          <h5>
            {lang.DEVICES.DEVICENUMBER}
          </h5>
          <FormGroup>
            <FormControl type="text" id="edtDPSTotalDevices" />
          </FormGroup>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div style={{ margin: '5px' }}>
        <div>
          <h5 style={{ marginBottom: '2ex' }}>
            {lang.DEVICES.SELECTMETHOD}{' '}
          </h5>
          <Button style={{ width: '40%' }} onClick={this.onClickManual}>
            {lang.DEVICES.MANUAL}
          </Button>
          <Button
            style={{ width: '40%', float: 'right' }}
            onClick={this.onClickAutomatic}
          >
            {lang.DEVICES.AUTOMATIC}
          </Button>
        </div>

        {this.renderManualSection()}

        {this.renderAutomaticSection()}

        <div
          style={{
            display:
              this.state.provisionMethod === 'manual' ||
              this.state.provisionMethod === 'automatic'
                ? 'block'
                : 'none'
          }}
        >
          <Button
            style={{ float: 'right' }}
            onClick={this.onClickCreateDevice}
            disabled={!this.isValid()}
          >
            {lang.DEVICES.CREATEDEVICE}{' '}
          </Button>
        </div>
      </div>
    );
  }
}

export default DeviceProvisioningWorkflow;
