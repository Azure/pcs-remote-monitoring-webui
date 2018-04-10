// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { TelemetryService } from 'services';
import { DeviceIcon } from './deviceIcon';
import { RulesGrid, rulesColumnDefs } from 'components/pages/rules/rulesGrid';
import {
  copyToClipboard,
  svgs,
  translateColumnDefs
} from 'utilities';
import {
  Btn,
  BtnToolbar,
  ErrorMsg,
  SectionDesc
} from 'components/shared';
import Flyout from 'components/shared/flyout';
import {
  PropertyGrid as Grid,
  PropertyGridBody as GridBody,
  PropertyGridHeader as GridHeader,
  PropertyRow as Row,
  PropertyCell as Cell
} from './propertyGrid';

import './deviceDetails.css';

const Section = Flyout.Section;

export class DeviceDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alarms: undefined,
      isAlarmsPending: false,
      alarmsError: undefined
    };
    this.columnDefs = [
      rulesColumnDefs.ruleName,
      rulesColumnDefs.severity,
      rulesColumnDefs.alarmStatus,
      rulesColumnDefs.explore
    ];
  }

  componentDidMount() {
    if (!this.props.rulesLastUpdated) this.props.fetchRules();
    this.fetchAlarms((this.props.device || {}).id);
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.device || {}).id !== nextProps.device.id) {
      this.fetchAlarms((nextProps.device || {}).id);
    }
  }

  componentWillUnmount() {
    this.alarmSubscription.unsubscribe();
  }

  applyRuleNames = (alarms, rules) =>
    alarms.map(alarm => ({
      ...alarm,
      name: (rules[alarm.ruleId] || {}).name
    }));

  fetchAlarms = (deviceId) => {
    this.setState({ isAlarmsPending: true });

    this.alarmSubscription = TelemetryService.getAlarms({
      limit: 5,
      order: "desc",
      devices: deviceId
    })
      .subscribe(
        alarms => this.setState({ alarms, isAlarmsPending: false, alarmsError: undefined }),
        alarmsError => this.setState({ alarmsError, isAlarmsPending: false })
      );
  }

  render() {
    const { t, onClose, device } = this.props;
    const isPending = this.state.isAlarmsPending && this.props.isRulesPending;
    const rulesGridProps = {
      rowData: isPending ? undefined : this.applyRuleNames(this.state.alarms || [], this.props.rules || []),
      t: this.props.t,
      columnDefs: translateColumnDefs(this.props.t, this.columnDefs)
    };
    const tags = Object.entries(device.tags || {});
    const methods = device.methods ? device.methods.split(',') : [];
    const properties = Object.entries(device.properties || {});
    return (
      <Flyout.Container>
        <Flyout.Header>
          <Flyout.Title>{t('devices.flyouts.details.title')}</Flyout.Title>
          <Flyout.CloseBtn onClick={onClose} />
        </Flyout.Header>
        <Flyout.Content className="device-details-container">
          {
            !device &&
            <div className="device-details-container">
              <ErrorMsg>{t("devices.flyouts.details.noDevice")}</ErrorMsg>
            </div>
          }
          {
            !!device &&
            <div className="device-details-container">

              <Grid className="device-details-header">
                <Row>
                  <Cell className="col-3"><DeviceIcon type={device.type} /></Cell>
                  <Cell className="col-7">
                    <div className="device-name">{device.id}</div>
                    <div className="device-simulated">{device.isSimulated ? t('devices.flyouts.details.simulated') : t('devices.flyouts.details.notSimulated')}</div>
                    <div className="device-connected">{device.connected ? t('devices.flyouts.details.connected') : t('devices.flyouts.details.notConnected')}</div>
                  </Cell>
                </Row>
              </Grid>

              {(!this.state.isAlarmsPending && this.state.alarms && (this.state.alarms.length > 0)) && <RulesGrid {...rulesGridProps} />}

              <Section.Container>
                <Section.Header>{t('devices.flyouts.details.telemetry.title')}</Section.Header>
                <Section.Content>TODO: Add chart when able.</Section.Content>
              </Section.Container>

              <Section.Container>
                <Section.Header>{t('devices.flyouts.details.tags.title')}</Section.Header>
                <Section.Content>
                  <SectionDesc>{t('devices.flyouts.details.tags.description')}</SectionDesc>
                  {
                    (tags.length === 0) &&
                    t('devices.flyouts.details.tags.noneExist')
                  }
                  {
                    (tags.length > 0) &&
                    <Grid>
                      <GridHeader>
                        <Row>
                          <Cell className="col-3">{t('devices.flyouts.details.tags.keyHeader')}</Cell>
                          <Cell className="col-7">{t('devices.flyouts.details.tags.valueHeader')}</Cell>
                        </Row>
                      </GridHeader>
                      <GridBody>
                        {
                          tags.map(([tagName, tagValue], idx) =>
                            <Row key={idx}>
                              <Cell className="col-3">{tagName}</Cell>
                              <Cell className="col-7">{tagValue.toString()}</Cell>
                            </Row>
                          )
                        }
                      </GridBody>
                    </Grid>
                  }
                </Section.Content>
              </Section.Container>

              <Section.Container>
                <Section.Header>{t('devices.flyouts.details.methods.title')}</Section.Header>
                <Section.Content>
                  <SectionDesc>{t('devices.flyouts.details.methods.description')}</SectionDesc>
                  {
                    (methods.length === 0) &&
                    t('devices.flyouts.details.methods.noneExist')
                  }
                  {
                    (methods.length > 0) &&
                    <Grid>
                      {
                        methods.map((methodName, idx) =>
                          <Row key={idx}>
                            <Cell>{methodName}</Cell>
                          </Row>
                        )
                      }
                    </Grid>
                  }
                </Section.Content>
              </Section.Container>

              <Section.Container>
                <Section.Header>{t('devices.flyouts.details.properties.title')}</Section.Header>
                <Section.Content>
                  <SectionDesc>{t('devices.flyouts.details.properties.description')}</SectionDesc>
                  {
                    (properties.length === 0) &&
                    t('devices.flyouts.details.properties.noneExist')
                  }
                  {
                    (properties.length > 0) && [
                      <Grid key="properties">
                        <GridHeader>
                          <Row>
                            <Cell className="col-3">{t('devices.flyouts.details.properties.keyHeader')}</Cell>
                            <Cell className="col-7">{t('devices.flyouts.details.properties.valueHeader')}</Cell>
                          </Row>
                        </GridHeader>
                        <GridBody>
                          {
                            properties.map(([propertyName, propertyValue], idx) =>
                              <Row key={idx}>
                                <Cell className="col-3">{propertyName}</Cell>
                                <Cell className="col-7">{propertyValue.toString().replace(/,/g, ", ")}</Cell>
                              </Row>
                            )
                          }
                        </GridBody>
                      </Grid>,
                      <Grid key="properties-actions" className="device-properties-actions">
                        <Row>
                          <Cell className="col-8">{t('devices.flyouts.details.properties.copyAllProperties')}</Cell>
                          <Cell className="col-2"><Btn svg={svgs.copy} onClick={() => copyToClipboard(JSON.stringify(properties))} >{t('devices.flyouts.details.properties.copy')}</Btn></Cell>
                        </Row>
                      </Grid>
                    ]
                  }
                </Section.Content>
              </Section.Container>

              <Section.Container>
                <Section.Header>{t('devices.flyouts.details.diagnostics.title')}</Section.Header>
                <Section.Content>
                  <SectionDesc>{t('devices.flyouts.details.diagnostics.description')}</SectionDesc>
                  TODO: Add diagnostics.
                </Section.Content>
              </Section.Container>
            </div>
          }
          <BtnToolbar>
            <Btn svg={svgs.cancelX} onClick={onClose}>{t('devices.flyouts.details.close')}</Btn>
          </BtnToolbar>
        </Flyout.Content>
      </Flyout.Container>
    );
  }
}
