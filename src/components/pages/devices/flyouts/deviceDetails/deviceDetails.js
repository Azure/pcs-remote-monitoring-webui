// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Trans } from 'react-i18next';
import { Subject } from 'rxjs';
import moment from 'moment';
import { DEFAULT_TIME_FORMAT } from 'components/shared/pcsGrid/pcsGridConfig';

import Config from 'app.config';
import { TelemetryService } from 'services';
import { DeviceIcon } from './deviceIcon';
import { RulesGrid, rulesColumnDefs } from 'components/pages/rules/rulesGrid';
import {
  copyToClipboard,
  int,
  svgs,
  translateColumnDefs
} from 'utilities';
import {
  Btn,
  BtnToolbar,
  ComponentArray,
  ErrorMsg,
  Hyperlink,
  PropertyGrid as Grid,
  PropertyGridBody as GridBody,
  PropertyGridHeader as GridHeader,
  PropertyRow as Row,
  PropertyCell as Cell,
  SectionDesc
} from 'components/shared';
import Flyout from 'components/shared/flyout';
import { TelemetryChart, chartColorObjects } from 'components/pages/dashboard/panels/telemetry';
import { transformTelemetryResponse } from 'components/pages/dashboard/panels';

import './deviceDetails.css';

const Section = Flyout.Section;

export class DeviceDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alerts: undefined,
      isAlertsPending: false,
      alertsError: undefined,

      telemetry: {},
      telemetryIsPending: true,
      telemetryError: null,

      showRawMessage: false
    };

    this.columnDefs = [
      {
        ...rulesColumnDefs.ruleName,
        cellRendererFramework: undefined // Don't allow soft select from an open flyout
      },
      rulesColumnDefs.severity,
      rulesColumnDefs.alertStatus,
      rulesColumnDefs.explore
    ];

    this.resetTelemetry$ = new Subject();
    this.telemetryRefresh$ = new Subject();
  }

  componentDidMount() {
    if (!this.props.rulesLastUpdated) this.props.fetchRules();

    const {
      device = {},
      device: {
        telemetry: {
          interval = '0'
        } = {}
      } = {}
    } = this.props;

    const deviceId = device.id;
    this.fetchAlerts(deviceId);

    const [hours = 0, minutes = 0, seconds = 0] = interval.split(':').map(int);
    const refreshInterval = ((((hours * 60) + minutes) * 60) + seconds) * 1000;

    // Telemetry stream - START
    const onPendingStart = () => this.setState({ telemetryIsPending: true });

    const telemetry$ =
      this.resetTelemetry$
        .do(_ => this.setState({ telemetry: {} }))
        .switchMap(deviceId =>
          TelemetryService.getTelemetryByDeviceIdP15M([deviceId])
            .merge(
              this.telemetryRefresh$ // Previous request complete
                .delay(refreshInterval || Config.dashboardRefreshInterval) // Wait to refresh
                .do(onPendingStart)
                .flatMap(_ => TelemetryService.getTelemetryByDeviceIdP1M([deviceId]))
            )
            .flatMap(messages =>
              transformTelemetryResponse(() => this.state.telemetry)(messages)
                .map(telemetry => ({ telemetry, lastMessage: messages[0] }))
            )
            .map(newState => ({ ...newState, telemetryIsPending: false })) // Stream emits new state
        )
    // Telemetry stream - END

    this.telemetrySubscription = telemetry$.subscribe(
      telemetryState => this.setState(
        telemetryState,
        () => this.telemetryRefresh$.next('r')
      ),
      telemetryError => this.setState({ telemetryError, telemetryIsPending: false })
    );

    this.resetTelemetry$.next(deviceId);
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.device || {}).id !== nextProps.device.id) {
      const deviceId = (nextProps.device || {}).id;
      this.resetTelemetry$.next(deviceId);
      this.fetchAlerts(deviceId);
    }
  }

  componentWillUnmount() {
    this.alertSubscription.unsubscribe();
    this.telemetrySubscription.unsubscribe();
  }

  copyDevicePropertiesToClipboard = () => {
    if (this.props.device) {
      copyToClipboard(JSON.stringify(this.props.device.properties || {}));
    }
  }

  toggleRawDiagnosticsMessage = () => {
    this.setState({ showRawMessage: !this.state.showRawMessage });
  }

  applyRuleNames = (alerts, rules) =>
    alerts.map(alert => ({
      ...alert,
      name: (rules[alert.ruleId] || {}).name
    }));

  fetchAlerts = (deviceId) => {
    this.setState({ isAlertsPending: true });

    this.alertSubscription = TelemetryService.getAlerts({
      limit: 5,
      order: "desc",
      devices: deviceId
    })
      .subscribe(
        alerts => this.setState({ alerts, isAlertsPending: false, alertsError: undefined }),
        alertsError => this.setState({ alertsError, isAlertsPending: false })
      );
  }

  render() {
    const { t, onClose, device, theme, timeSeriesExplorerUrl } = this.props;
    const { telemetry, lastMessage } = this.state;
    const lastMessageTime = (lastMessage || {}).time;
    const isPending = this.state.isAlertsPending && this.props.isRulesPending;
    const rulesGridProps = {
      rowData: isPending ? undefined : this.applyRuleNames(this.state.alerts || [], this.props.rules || []),
      t: this.props.t,
      deviceGroups: this.props.deviceGroups,
      domLayout: 'autoHeight',
      columnDefs: translateColumnDefs(this.props.t, this.columnDefs),
      suppressFlyouts: true
    };
    const tags = Object.entries(device.tags || {});
    const properties = Object.entries(device.properties || {});

    // Add parameters to Time Series Insights Url
    const timeSeriesParamUrl =
      timeSeriesExplorerUrl
        ? timeSeriesExplorerUrl +
        `&relativeMillis=1800000&timeSeriesDefinitions=[{"name":"${device.id}","measureName":"${Object.keys(telemetry).sort()[0]}","predicate":"'${device.id}'"}]`
        : undefined;

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

              {
                (!this.state.isAlertsPending && this.state.alerts && (this.state.alerts.length > 0))
                && <RulesGrid {...rulesGridProps} />
              }

              <Section.Container>
                <Section.Header>{t('devices.flyouts.details.telemetry.title')}</Section.Header>
                <Section.Content>
                  {
                    timeSeriesExplorerUrl &&
                    <Hyperlink className="time-series-explorer" href={timeSeriesParamUrl} target="_blank">{t('devices.flyouts.details.telemetry.exploreTimeSeries')}</Hyperlink>
                  }
                  <TelemetryChart className="telemetry-chart" telemetry={telemetry} theme={theme} colors={chartColorObjects} />
                </Section.Content>
              </Section.Container>

              <Section.Container>
                <Section.Header>{t('devices.flyouts.details.tags.title')}</Section.Header>
                <Section.Content>
                  <SectionDesc>
                    <Trans i18nKey={"devices.flyouts.details.tags.description"}>
                      To edit, close this panel, click on
                      <strong>{{ jobs: t('devices.flyouts.jobs.title') }}</strong>
                      then select
                      <strong>{{ tags: t('devices.flyouts.jobs.tags.radioLabel') }}</strong>.
                    </Trans>
                  </SectionDesc>
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
                  <SectionDesc>
                    <Trans i18nKey={"devices.flyouts.details.methods.description"}>
                      To edit, close this panel, click on
                      <strong>{{ jobs: t('devices.flyouts.jobs.title') }}</strong>
                      then select
                      <strong>{{ methods: t('devices.flyouts.jobs.methods.radioLabel') }}</strong>.
                    </Trans>
                  </SectionDesc>
                  {
                    (device.methods.length === 0)
                      ? t('devices.flyouts.details.methods.noneExist')
                      :
                      <Grid>
                        {
                          device.methods.map((methodName, idx) =>
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
                  <SectionDesc>
                    <Trans i18nKey={"devices.flyouts.details.properties.description"}>
                      To edit, close this panel, click on
                      <strong>{{ jobs: t('devices.flyouts.jobs.title') }}</strong>
                      then select
                      <strong>{{ properties: t('devices.flyouts.jobs.properties.radioLabel') }}</strong>.
                    </Trans>
                  </SectionDesc>
                  {
                    (properties.length === 0) &&
                    t('devices.flyouts.details.properties.noneExist')
                  }
                  {
                    (properties.length > 0) &&
                    <ComponentArray>
                      <Grid>
                        <GridHeader>
                          <Row>
                            <Cell className="col-3">{t('devices.flyouts.details.properties.keyHeader')}</Cell>
                            <Cell className="col-7">{t('devices.flyouts.details.properties.valueHeader')}</Cell>
                          </Row>
                        </GridHeader>
                        <GridBody>
                          {
                            properties.map(([propertyName, propertyValue], idx) => {
                              const desiredPropertyValue = device.desiredProperties[propertyName];
                              const displayValue = !desiredPropertyValue || propertyValue === desiredPropertyValue
                                ? propertyValue.toString()
                                : t('devices.flyouts.details.properties.syncing', { reportedPropertyValue: propertyValue.toString(), desiredPropertyValue: desiredPropertyValue.toString() });
                              return (
                                <Row key={idx}>
                                  <Cell className="col-3">{propertyName}</Cell>
                                  <Cell className="col-7">{displayValue}</Cell>
                                </Row>
                              );
                            })
                          }
                        </GridBody>
                      </Grid>
                      <Grid className="device-properties-actions">
                        <Row>
                          <Cell className="col-8">{t('devices.flyouts.details.properties.copyAllProperties')}</Cell>
                          <Cell className="col-2"><Btn svg={svgs.copy} onClick={this.copyDevicePropertiesToClipboard} >{t('devices.flyouts.details.properties.copy')}</Btn></Cell>
                        </Row>
                      </Grid>
                    </ComponentArray>
                  }
                </Section.Content>
              </Section.Container>

              <Section.Container>
                <Section.Header>{t('devices.flyouts.details.diagnostics.title')}</Section.Header>
                <Section.Content>
                  <SectionDesc>{t('devices.flyouts.details.diagnostics.description')}</SectionDesc>

                  <Grid className="device-details-diagnostics">
                    <GridHeader>
                      <Row>
                        <Cell className="col-3">{t('devices.flyouts.details.diagnostics.keyHeader')}</Cell>
                        <Cell className="col-7">{t('devices.flyouts.details.diagnostics.valueHeader')}</Cell>
                      </Row>
                    </GridHeader>
                    <GridBody>
                      <Row>
                        <Cell className="col-3">{t('devices.flyouts.details.diagnostics.status')}</Cell>
                        <Cell className="col-7">{device.connected ? t('devices.flyouts.details.connected') : t('devices.flyouts.details.notConnected')}</Cell>
                      </Row>
                      {
                        device.connected &&
                        <ComponentArray>
                          <Row>
                            <Cell className="col-3">{t('devices.flyouts.details.diagnostics.lastMessage')}</Cell>
                            <Cell className="col-7">{lastMessageTime ? moment(lastMessageTime).format(DEFAULT_TIME_FORMAT) : '---'}</Cell>
                          </Row>
                          <Row>
                            <Cell className="col-3">{t('devices.flyouts.details.diagnostics.message')}</Cell>
                            <Cell className="col-7">
                              <Btn className="raw-message-button" onClick={this.toggleRawDiagnosticsMessage}>{t('devices.flyouts.details.diagnostics.showMessage')}</Btn>
                            </Cell>
                          </Row>
                        </ComponentArray>
                      }
                      {
                        this.state.showRawMessage &&
                        <Row>
                          <pre>{JSON.stringify(lastMessage, null, 2)}</pre>
                        </Row>
                      }
                    </GridBody>
                  </Grid>

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
