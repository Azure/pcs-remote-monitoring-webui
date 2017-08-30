// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import FlyoutSection from './flyoutSection/flyoutSection'
import Select from 'react-select';
import DeviceSimulationService from '../../services/deviceSimulationService';
import IotHubManagerService from '../../services/iotHubManagerService';
import Rx from 'rxjs';

import './deviceProvisioningWorkflow.css';

// Form value enums
const deviceTypeValues = {
  SIMULATED: 'simulated',
  PHYSICAL: 'physical'
};

const deviceIdTypeValues = {
  GENERATED: 'generated',
  CUSTOM: 'custom'
};

const authKeyValues = {
  AUTO: 'auto',
  MANUAL: 'manual'
};

const initialState = {
  deviceTypeForm: undefined,
  numDevices: 1,
  deviceIdType: deviceIdTypeValues.CUSTOM,
  deviceIdPrefix: '',
  deviceModel: undefined,
  authType: undefined,
  authKey: undefined,
  primaryKey: '',
  secondaryKey: '',
  formIsValid: false,
  deviceModels: [],
  isLoading: false
}

/** 
 * The DeviceProvisioningWorkflow component is resposible for rendering the provisioning forms 
 * in the flyout.
 * 
 * TODO (stpryor): Consider moving the simulated and physical forms into their own components
 */
class DeviceProvisioningWorkflow extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.apply = this.apply.bind(this);
  }

  /**
   * Makes a call to load the device models into the component state
   */
  componentDidMount() {
    Rx.Observable
      .fromPromise(DeviceSimulationService.getDevicemodels())
      .map(models => models.map(model => ({ // Format the models list for the select component
        value: model.Id,
        label: model.Name
      })))
      .subscribe(
        models => this.setState({ deviceModels: models })
      );
  }

  /**
   * Resets the component state to the initial state
   * 
   * @param {Object} overrides - An object of any state values that to be persisted across a state reset
   */
  resetInitialState(overrides = {}) {
    this.setState({ 
      ...initialState, 
      ...overrides,
      deviceModels: this.state.deviceModels // Keep any cached device models
    } );
  }

  /**
   * A generic handler method for updating state when an input changes
   * 
   * @param {Object} event - A DOM event object with the input change details
   */
  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    
    // If the device type is changed, reset to the initial state
    if (name === 'deviceTypeForm' && this.state.deviceTypeForm !== undefined && value !== this.state.deviceTypeForm) {
      this.resetInitialState({ [name]: value });
    } else { // Otherwise, change only the state value requested
      this.setState(
        { [name]: value }, // 1) Update the state
        () => this.validateForm() // 2) Then validate the new state
      );
    }
  }

  /**
   * Checks if the given value is an integer
   * 
   * @param {any} value - Some value that may or may not be an integer
   * @returns Returns true if the parameter is an integer
   */
  isInteger(value) {
    return !isNaN(value) && parseInt(value, 10) === parseFloat(value);
  }

  /**
   * A helper method to validate the device id form section
   * 
   * @param {Object} state The state of the component for state variable access
   * @returns Returns true if the device id is valid
   */
  deviceIdIsValid(state) {
    const { deviceIdType, deviceIdPrefix } = state;
    return (deviceIdType === deviceIdTypeValues.GENERATED || (deviceIdType === deviceIdTypeValues.CUSTOM && deviceIdPrefix.trim().length > 0));
  }

  /**
   * Contains logic to validate the simulated device form
   * 
   * @param {Object} state The state of the component for state variable access
   * @returns Returns true if the simulated device form is valid
   */
  simulatedFormIsValid(state) {
    const { numDevices, deviceModel } = state;
    return (this.isInteger(numDevices) && numDevices > 0) // Validate number of devices
      && this.deviceIdIsValid(state) // Validate Device ID
      && (!!deviceModel); // Validate Device Model
  }

  /**
   * Contains logic to validate the physical device form
   * 
   * @param {Object} state The state of the component for state variable access
   * @returns Returns true if the physical device form is valid
   */
  physicalFormIsValid(state) {
    const { numDevices, authType, authKey, primaryKey, secondaryKey } = state;
    return (this.isInteger(numDevices) && numDevices > 0) // Validate number of devices
      && this.deviceIdIsValid(state) // Validate Device ID
      && !!authType // Validate auth type was selected
      // If authKey is manual, primaryKey and secondaryKey must also be selected,
      // otherwise auto is sufficient
      && (authKey === authKeyValues.AUTO 
        || (authKey === authKeyValues.MANUAL && primaryKey && secondaryKey));
  }

  /**
   * Validates the current form values
   * 
   * @returns Returns true if the currently displayed form is valid
   */
  validateForm() {
    let isValid;
    const state = this.state;
    switch (state.deviceTypeForm) {
      case deviceTypeValues.SIMULATED:
        isValid = this.simulatedFormIsValid(state);
        break;
      case deviceTypeValues.PHYSICAL:
        isValid = this.physicalFormIsValid(state);
        break;
      default:
        isValid = false;
    }
    this.setState({ formIsValid : isValid });
  }

  /**
   * Makes the service call to create a new physical device
   */
  createPhysicalDevice() {
    const state = this.state;
    this.setState({ isLoading: true });
    Rx.Observable.fromPromise(
      IotHubManagerService.createPhysicalDevice(state.deviceIdPrefix, state.primaryKey)
    ).subscribe(
      _ => this.resetInitialState({ deviceTypeForm: deviceTypeValues.PHYSICAL }),
      err => console.error(err),
      _ => this.setState({ isLoading: false })
    );
  }

  /**
   * Checks that the form is valid and selects the creation method for physical or simulated devices
   */
  apply() {
    if (this.state.formIsValid) {
      if (this.state.deviceTypeForm === deviceTypeValues.SIMULATED) {
        // TODO (stpryor): Pending implementation from backend
      } else if (this.state.deviceTypeForm === deviceTypeValues.PHYSICAL) {
        this.createPhysicalDevice();
      }
    }
  }

  /**
   * A helper method for generating a JSX list of radio inputs and labels
   * 
   * @param {string} radioGroupName A string with the name of the radio input (used as the HTML name attr)
   * @param {Object[]} radioItems The list of items (as objects) in the input group. Each object has a value and a label.
   * @returns Returns a JSX list of radio inputs and labels
   */
  renderRadioInputGroup(radioGroupName, radioItems) {
    return radioItems.map((item, index) => {
      const id = `radioBtn${radioGroupName + index}`;
      return (
        <div className="pcs-formgroup" key={id}>
          <input type="radio" 
                name={radioGroupName}
                id={id}
                value={item.value}
                checked={this.state[radioGroupName] === item.value} 
                onChange={this.handleInputChange} />
          <label htmlFor={id}>
            { item.label }
          </label>
        </div>
      );
    });
  }

  /**
   * A helper method for rendering the device id section of the form
   * 
   * @returns Returns JSX for the device ID section
   */
  renderDeviceIdSection() {
    return (
      <FlyoutSection header={'Device ID'}>
        { 
          this.renderRadioInputGroup('deviceIdType', [
            { 
              value: deviceIdTypeValues.CUSTOM,
              label: <input type="text" 
                name="deviceIdPrefix" 
                placeholder={'Enter device Id prefix...'}
                disabled={this.state.deviceIdType !== deviceIdTypeValues.CUSTOM}
                value={this.state.deviceIdPrefix}
                onChange={this.handleInputChange} />
            },
            { value: deviceIdTypeValues.GENERATED, label: 'System generated device IDs' }
          ]) 
        }
      </FlyoutSection>
    );
  }

  /**
   * Renders the summary portion of the simulated and physical device forms
   * 
   * @returns Returns JSX for the form summary
   */
  renderFormSummary() {
    return (
      <div className="form-summary-container">
        <div className="form-summary-header">{'Provision summary'}</div>
        <div className="form-summary-details">
          <span className="device-cnt">{this.isInteger(this.state.numDevices) ? Math.floor(this.state.numDevices):  0}</span> {'devices to provision'}
        </div>
        <div className="form-action-btns">
          <button className="pcs-btn">{'Cancel'}</button>
          <button className="pcs-btn primary" 
                  disabled={!this.state.formIsValid || this.state.isLoading} 
                  onClick={this.apply}>
            {this.state.isLoading ? 'Loading...': 'Apply'}
          </button>
        </div>
      </div>
    );
  }

  /**
   * Renders simulated device form
   * 
   * @returns Returns JSX for the simulated device form
   */
  renderSimulatedForm() {
    return (
      <div className="provision-device-form-container">
        <FlyoutSection header={'Number of devices'}>
          <div className="pcs-formgroup">
              <input type="text"
                    className="small"
                    name="numDevices" 
                    value={this.state.numDevices}
                    onChange={this.handleInputChange} />
          </div>
        </FlyoutSection>
        { this.renderDeviceIdSection() }
        <FlyoutSection header={'Device model'}>
          <Select
            options={this.state.deviceModels}
            value={this.state.deviceModel}
            onChange={value => this.handleInputChange({ target: {name: 'deviceModel', value: value }})}
            clearable={false}
            searchable={false}
            autosize={true}
            placeholder={this.state.deviceModels.length ? 'Select existing device type' : 'Loading...'}
          />
        </FlyoutSection>
        { this.renderFormSummary() }
      </div>
    );
  }

  /**
   * Renders physical device form
   * 
   * @returns Returns JSX for the physical device form
   */
  renderPhysicalForm() {
    return (
      <div className="provision-device-form-container">
        <FlyoutSection header={'Number of devices'}>
          <div className="pcs-formgroup">
              <label>{ this.state.numDevices }</label>
          </div>
        </FlyoutSection>
        { this.renderDeviceIdSection() }
        <FlyoutSection header={'Authentication type'}>
          { 
            this.renderRadioInputGroup('authType', [
              { value: 'symmetric', label: 'Symmetric Key' },
              { value: 'x509', label: 'X.509' }
            ]) 
          }
        </FlyoutSection>
        <FlyoutSection header={'Authentication key'}>
          { 
            this.renderRadioInputGroup('authKey', [
              { value: authKeyValues.AUTO, label: 'Auto generate keys' },
              { value: authKeyValues.MANUAL, label: 'Enter keys manually' }
            ]) 
          }
          <div className="manual-auth-key-container pcs-formgroup">
            <label htmlFor="primary-key-input">Primary Key</label>
            <input type="text" 
                  id="primary-key-input"
                  name="primaryKey" 
                  placeholder={'Enter your primary key here...'}
                  disabled={this.state.authKey !== authKeyValues.MANUAL}
                  value={this.state.primaryKey}
                  onChange={this.handleInputChange} />
            <label htmlFor="secondary-key-input">Secondary Key</label>
            <input type="text" 
                  id="secondary-key-input"
                  name="secondaryKey" 
                  placeholder={'Enter your secondary key here...'}
                  disabled={this.state.authKey !== authKeyValues.MANUAL}
                  value={this.state.secondary}
                  onChange={this.handleInputChange} />
          </div>
        </FlyoutSection>
        { this.renderFormSummary() }
      </div>
    );
  }

  /**
   * Renders the component markup
   */
  render() {
    const { deviceTypeForm } = this.state;

    let deviceForm = '';
    if (deviceTypeForm === deviceTypeValues.SIMULATED) {
      deviceForm = this.renderSimulatedForm();
    } else if (deviceTypeForm === deviceTypeValues.PHYSICAL) {
      deviceForm = this.renderPhysicalForm();
    }

    return (
      <div className="provision-workflow-container">
        <FlyoutSection header={'Device type'}>
          { 
            this.renderRadioInputGroup('deviceTypeForm', [
              { value: deviceTypeValues.SIMULATED, label: 'Simulated' },
              { value: deviceTypeValues.PHYSICAL, label: 'Physical' }
            ]) 
          }
        </FlyoutSection>
        { deviceForm }
      </div>
    );
  }
}

export default DeviceProvisioningWorkflow;
