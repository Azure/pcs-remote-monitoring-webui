// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import PcsBtn from '../shared/pcsBtn/pcsBtn';
import PscToggle from '../shared/pcsToggle/pcsToggle';
import DeviceSimulationService from '../../services/deviceSimulationService';
import lang from '../../common/lang';
import Spinner from '../spinner/spinner';

import CloseIconSvg from '../../assets/icons/X.svg';

import './settingFlyout.css';

// Helper objects for choosing the correct label for the simulation service toggle input
const desiredSimulationLabel = {
  true: lang.START,
  false: lang.STOP
};

const currSimulationLabel = {
  true: lang.RUNNING,
  false: lang.STOPPED
};

class SettingFlyout extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currSimulationState: undefined,
      desiredSimulationState: undefined,
      loading: false
    };

    this.eTag = new BehaviorSubject(undefined);
    this.unmount = new Subject();
    this.eTagStream = this.eTag.filter(_ => _);
  }

  componentDidMount() {
    Observable.fromPromise(DeviceSimulationService.getSimulatedDevices())
      .takeUntil(this.unmount)
      .subscribe(
        ({ Etag, Enabled }) => {
          this.setState({ 
            currSimulationState: Enabled,
            desiredSimulationState: Enabled
          });
          this.eTag.next(Etag);
        },
        err => this.eTag.error(err)
      );
  }

  componentWillUnmount() {
    this.unmount.next(undefined);
    this.unmount.unsubscribe();
  }

  onChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  apply = () => {
    Observable
      .of(this.state.desiredSimulationState)
      .do(_ => this.setState({ loading: true}))
      .zip(this.eTagStream, (Enabled, Etag) => ({ Etag, Enabled }))
      .flatMap(({ Etag, Enabled }) => DeviceSimulationService.toggleSimulation(Etag, Enabled))
      .takeUntil(this.unmount)
      .subscribe(
        () => this.props.onClose(),
        err => console.error(err)
      );
  };

  render() {
    const { currSimulationState, desiredSimulationState, loading } = this.state;
    const stillInitializing = currSimulationState === undefined;
    const hasChanged = !stillInitializing && currSimulationState !== desiredSimulationState;

    const simulationLabel = hasChanged ? desiredSimulationLabel[desiredSimulationState] : currSimulationLabel[currSimulationState];

    return (
      <div className="setting-workflow-container">
        <div className="setting-section">
          <div className="section-header">{ 'Version 0.0.1' }</div>
        </div>
        <div className="setting-section">
          <div className="section-header">{ lang.SIMULATION_DATA }</div>
          <div className="section-description">{ lang.SIMULATION_SETTINGS_DESC }</div>
          <div className="section-input-group">
            <PscToggle
              name="desiredSimulationState" 
              value={desiredSimulationState}
              disabled={stillInitializing}
              onChange={this.onChange} />
            <label>{ stillInitializing ? lang.LOADING : simulationLabel }</label>
          </div>
        </div>
        <div className="btn-container">
          <PcsBtn svg={CloseIconSvg} onClick={this.props.onClose}>{hasChanged ? lang.CANCEL : lang.CLOSE }</PcsBtn>
          { !loading && hasChanged && <PcsBtn onClick={this.apply}>{ lang.APPLY }</PcsBtn> }
          { loading && <Spinner size='small' /> }
        </div>
      </div>
    );
  }
}

export default SettingFlyout;
