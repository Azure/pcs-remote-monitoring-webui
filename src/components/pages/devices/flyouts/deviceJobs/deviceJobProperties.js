// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Link } from "react-router-dom";
import { Observable } from 'rxjs';
import update from 'immutability-helper';

import { IoTHubManagerService } from 'services';
import { toSubmitPropertiesJobRequestModel } from 'services/models';
import { svgs, LinkedComponent, Validator } from 'utilities';
import {
  AjaxError,
  Btn,
  BtnToolbar,
  ErrorMsg,
  FormControl,
  FormGroup,
  FormLabel,
  FormSection,
  Indicator,
  SectionDesc,
  SectionHeader,
  SummaryBody,
  SummaryCount,
  SummarySection,
  Svg
} from 'components/shared';
import {
  PropertyGrid as Grid,
  PropertyGridBody as GridBody,
  PropertyGridHeader as GridHeader,
  PropertyRow as Row,
  PropertyCell as Cell
} from 'components/pages/devices/flyouts/deviceDetails/propertyGrid';

update.extend('$autoArray', (val, obj) => update(obj || [], val));

const isNumeric = value => typeof value === 'number' || !isNaN(parseInt(value, 10));
const isAlphaNumericRegex = /^[a-zA-Z0-9]*$/;
const nonAlphaNumeric = x => !x.match(isAlphaNumericRegex);

export const propertyJobConstants = {
  firmware: 'Firmware',
  multipleValues: 'Multiple',
  stringType: 'Text',
  numberType: 'Number'
};

const initialState = {
  isPending: false,
  error: undefined,
  successCount: 0,
  changesApplied: false,
  jobName: undefined,
  jobId: undefined,
  commonProperties: [],
  deletedProperties: []
};

export class DeviceJobProperties extends LinkedComponent {
  constructor(props) {
    super(props);
    this.state = initialState;

    // Linked components
    this.jobNameLink = this.linkTo('jobName')
      .reject(nonAlphaNumeric)
      .check(Validator.notEmpty, () => this.props.t('devices.flyouts.jobs.validation.required'));

    this.propertiesLink = this.linkTo('commonProperties');
  }

  componentDidMount() {
    if (this.props.devices) {
      this.populateState(this.props.devices);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.devices && (this.props.devices || []).length !== nextProps.devices.length) {
      this.populateState(nextProps.devices);
    }
  }

  componentWillUnmount() {
    if (this.populateStateSubscription) this.populateStateSubscription.unsubscribe();
    if (this.submitJobSubscription) this.submitJobSubscription.unsubscribe();
  }

  populateState = (devices) => {
    const { t } = this.props;

    if (this.populateStateSubscription) this.populateStateSubscription.unsubscribe();

    // Rework device data so the reported and desired values are grouped together under the property name.
    const devicesWithProps = devices.map(device => {
      const properties = {};
      Object.keys(device.properties).forEach((propertyName) => {
        const reported = device.properties[propertyName];
        const desired = device.desiredProperties[propertyName];
        const inSync = !desired || reported === desired;
        const display = inSync ? reported : t('devices.flyouts.jobs.properties.syncing', { reportedPropertyValue: reported, desiredPropertyValue: desired });
        properties[propertyName] = { reported, desired, display, inSync };
      });
      return { id: device.id, properties };
    });

    this.populateStateSubscription = Observable.from(devicesWithProps)
      .map(({ properties }) => new Set(Object.keys(properties)))
      .reduce((commonProperties, deviceProperties) =>
        commonProperties
          ? new Set([...commonProperties].filter(property => deviceProperties.has(property)))
          : deviceProperties
      ) // At this point, a stream of a single event. A common set of properties.
      .flatMap(commonPropertiesSet =>
        Observable.from(devicesWithProps)
          .flatMap(({ properties }) => Object.entries(properties))
          .filter(([property]) => commonPropertiesSet.has(property))
      )
      .distinct(([propertyName, propertyVal]) => `${propertyName} ${propertyVal.display}`)
      .reduce((acc, [propertyName, propertyVal]) => update(acc, {
        [propertyName]: {
          $autoArray: {
            $push: [propertyVal]
          }
        }
      }), {})
      .flatMap(propertyToValMap => Object.entries(propertyToValMap))
      .reduce(
        (newState, [name, values]) => {
          const valueData = values.reduce((valAcc, { reported, desired, display, inSync }) => {
            if (!valAcc.reported) {
              valAcc.reported = reported;
              valAcc.display = display;
            }
            if (!inSync) {
              valAcc.anyOutOfSync = true;
            };
            if (reported !== valAcc.reported) {
              valAcc.reported = propertyJobConstants.multipleValues;
              valAcc.display = valAcc.anyOutOfSync
                ? t('devices.flyouts.jobs.properties.syncing', { reportedPropertyValue: propertyJobConstants.multipleValues, desiredPropertyValue: '' })
                : propertyJobConstants.multipleValues;
            }
            if (!isNumeric(reported)) {
              valAcc.type = propertyJobConstants.stringType;
            };
            return valAcc;
          },
            {
              reported: undefined,
              display: undefined,
              anyOutOfSync: false,
              type: propertyJobConstants.numberType,
            });
          return update(newState, {
            commonProperties: {
              $push: [{
                name,
                value: valueData.display,
                type: valueData.type,
                readOnly: name === propertyJobConstants.firmware || valueData.anyOutOfSync
              }]
            }
          });
        },
        { ...initialState, jobName: this.state.jobName }
      ).subscribe(newState => this.setState(newState));
  }

  formIsValid() {
    return [
      this.jobNameLink
    ].every(link => !link.error);
  }

  apply = (event) => {
    event.preventDefault();
    if (this.formIsValid()) {
      this.setState({ isPending: true });

      const { devices } = this.props;
      const { commonProperties, deletedProperties } = this.state;
      const updatedProperties = commonProperties.filter(({ value, readOnly }) => value !== propertyJobConstants.multipleValues && !readOnly);
      const request = toSubmitPropertiesJobRequestModel(devices, update(this.state, { updatedProperties: { $set: updatedProperties } }));

      if (this.submitJobSubscription) this.submitJobSubscription.unsubscribe();
      this.submitJobSubscription = IoTHubManagerService.submitJob(request)
        .subscribe(
          ({ jobId }) => {
            this.setState({ jobId, successCount: devices.length, isPending: false, changesApplied: true });
            this.props.updateProperties({ deviceIds: devices.map(({ id }) => id), updatedProperties, deletedProperties });
          },
          error => {
            this.setState({ error, isPending: false, changesApplied: true });
          }
        );
    }
  }

  getSummaryMessage() {
    const { t } = this.props;
    const { isPending, changesApplied } = this.state;

    if (isPending) {
      return t('devices.flyouts.jobs.pending');
    } else if (changesApplied) {
      return t('devices.flyouts.jobs.applySuccess');
    } else {
      return t('devices.flyouts.jobs.affected');
    }
  }

  render() {
    const {
      t,
      onClose,
      devices
    } = this.props;
    const {
      isPending,
      error,
      successCount,
      changesApplied,
      commonProperties = []
    } = this.state;

    const summaryCount = changesApplied ? successCount : devices.length;
    const completedSuccessfully = changesApplied && successCount === devices.length;
    const summaryMessage = this.getSummaryMessage();

    // Link these values in render because they need to update based on component state
    const propertyLinks = this.propertiesLink.getLinkedChildren(propertyLink => {
      const name = propertyLink.forkTo('name')
        .check(Validator.notEmpty, this.props.t('devices.flyouts.jobs.validation.required'));
      const value = propertyLink.forkTo('value')
        .check(Validator.notEmpty, this.props.t('devices.flyouts.jobs.validation.required'));
      const type = propertyLink.forkTo('type')
        .map(({ value }) => value)
        .check(Validator.notEmpty, this.props.t('devices.flyouts.jobs.validation.required'));
      const readOnly = propertyLink.forkTo('readOnly');
      const edited = !(!name.value && !value.value && !type.value);
      const error = (edited && (name.error || value.error || type.error)) || '';
      return { name, value, type, readOnly, edited, error };
    });
    const editedProperties = propertyLinks.filter(({ edited }) => edited);
    const propertiesHaveErrors = editedProperties.some(({ error }) => !!error);

    return (
      <form onSubmit={this.apply} >
        <FormSection className="device-job-properties-container">
          <SectionHeader>{t('devices.flyouts.jobs.properties.title')}</SectionHeader>
          <SectionDesc>{t('devices.flyouts.jobs.properties.description')}</SectionDesc>

          <FormGroup>
            <FormLabel>{t('devices.flyouts.jobs.jobName')}</FormLabel>
            <div className="help-message">{t('devices.flyouts.jobs.jobNameHelpMessage')}</div>
            <FormControl className="long" link={this.jobNameLink} type="text" placeholder={t('devices.flyouts.jobs.jobNameHint')} />
          </FormGroup>

          <Grid className="data-grid">
            <GridHeader>
              <Row>
                <Cell className="col-3">{t('devices.flyouts.jobs.properties.keyHeader')}</Cell>
                <Cell className="col-3">{t('devices.flyouts.jobs.properties.valueHeader')}</Cell>
                <Cell className="col-3">{t('devices.flyouts.jobs.properties.typeHeader')}</Cell>
                <Cell className="col-1"></Cell>
              </Row>
            </GridHeader>
            <GridBody>
              {
                Object.keys(commonProperties).length === 0 &&
                <ErrorMsg className="device-jobs-error">{t('devices.flyouts.jobs.properties.noneExist')}</ErrorMsg>
              }
              {
                Object.keys(commonProperties).length > 0 &&
                propertyLinks.map(({ name, value, type, readOnly, edited, error }, idx) => [
                  <Row key={idx} className={error ? 'error-data-row' : ''}>
                    <Cell className="col-3 text-only">
                      {name.value}
                    </Cell>
                    <Cell className="col-3">
                      <FormControl className="small" type="text" link={value} errorState={!!error} readOnly={readOnly.value} /></Cell>
                    <Cell className="col-3 text-only">
                      {type.value}
                    </Cell>
                  </Row>,
                  error
                    ? <Row key={`${idx}-error`} className="error-msg-row"><ErrorMsg>{error}</ErrorMsg></Row>
                    : null
                ])
              }
            </GridBody>
          </Grid>

          <SummarySection>
            <SectionHeader>{t('devices.flyouts.jobs.summaryHeader')}</SectionHeader>
            <SummaryBody>
              <SummaryCount>{summaryCount}</SummaryCount>
              <SectionDesc>{summaryMessage}</SectionDesc>
              {this.state.isPending && <Indicator />}
              {completedSuccessfully && <Svg className="summary-icon" path={svgs.apply} />}
            </SummaryBody>
          </SummarySection>

          {error && <AjaxError className="device-jobs-error" t={t} error={error} />}
          {
            !changesApplied &&
            <BtnToolbar>
              <Btn
                svg={svgs.reconfigure}
                primary={true}
                disabled={!this.formIsValid() || propertiesHaveErrors || isPending}
                type="submit">
                {t('devices.flyouts.jobs.apply')}
              </Btn>
              <Btn svg={svgs.cancelX} onClick={onClose}>{t('devices.flyouts.jobs.cancel')}</Btn>
            </BtnToolbar>
          }
          {
            !!changesApplied &&
            <BtnToolbar>
              <Link to={`/maintenance/job/${this.state.jobId}`} className="btn btn-primary">{t('devices.flyouts.jobs.viewStatus')}</Link>
              <Btn svg={svgs.cancelX} onClick={onClose}>{t('devices.flyouts.jobs.close')}</Btn>
            </BtnToolbar>
          }
        </FormSection>
      </form>
    )
  }
}
