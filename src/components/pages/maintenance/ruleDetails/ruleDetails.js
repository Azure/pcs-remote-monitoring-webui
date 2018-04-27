// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Subject } from 'rxjs';

import Config from 'app.config';
import { RulesGrid } from 'components/pages/rules/rulesGrid';
import { AjaxError, PageContent, ContextMenu, RefreshBar } from 'components/shared';
import { joinClasses, renderUndefined } from 'utilities';
import { DevicesGrid } from 'components/pages/devices/devicesGrid';
import { TelemetryChart, transformTelemetryResponse, chartColorObjects } from 'components/pages/dashboard/panels/telemetry';
import { TelemetryService } from 'services';
import { TimeRenderer, SeverityRenderer } from 'components/shared/cellRenderers';
import { AlarmOccurrencesGrid } from 'components/pages/maintenance/grids';

import './ruleDetails.css';

const tabIds = {
  all: 'all',
  devices: 'devices',
  telemetry: 'telemetry'
};

const idDelimiter = ' ';

export class RuleDetails extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedAlert: undefined,
      selectedRule: undefined,

      telemetryIsPending: true,
      telemetry: {},
      telemetryError: undefined,

      devices: [],
      deviceIds: '',
      occurrences: [],
      selectedTab: tabIds.all,

      ruleContextBtns: undefined,
      alarmContextBtns: undefined,
      deviceContextBtns: undefined
    };

    this.restartTelemetry$ = new Subject();
    this.telemetryRefresh$ = new Subject();

    this.subscriptions = [];
  }

  componentDidMount() {
    // Telemetry stream - START
    const onPendingStart = () => this.setState({ telemetryIsPending: true });

    this.subscriptions.push(
      this.restartTelemetry$
        .distinctUntilChanged()
        .filter(deviceIds => deviceIds)
        .map(deviceIds => deviceIds.split(idDelimiter))
        .do(() => this.setState({ telemetry: {}, telemetryIsPending: false }))
        .switchMap(deviceIds =>
          TelemetryService.getTelemetryByDeviceIdP15M(deviceIds)
            .merge(
              this.telemetryRefresh$ // Previous request complete
                .delay(Config.telemetryRefreshInterval) // Wait to refresh
                .do(onPendingStart)
                .flatMap(_ => TelemetryService.getTelemetryByDeviceIdP1M(deviceIds))
            )
            .flatMap(transformTelemetryResponse(() => this.state.telemetry))
            .map(telemetry => ({ telemetry, telemetryIsPending: false }))
        )
        .subscribe(
          telemetryState => this.setState(
            telemetryState,
            () => this.telemetryRefresh$.next('r')
          ),
          telemetryError => this.setState({ telemetryError, telemetryIsPending: false })
        )
    );

    this.handleProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.handleProps(nextProps);
  }

  handleProps(nextProps) {
    const {
      alerts,
      deviceEntities,
      match,
      rulesEntities
    } = nextProps;
    const selectedId = match.params.id;
    const selectedRule = rulesEntities[selectedId];
    const selectedAlert = alerts.filter(({ ruleId }) => ruleId === selectedId)[0] || {};
    const occurrences = (selectedAlert.alarms || [])
      .map(alarm => ({ ...alarm, name: selectedRule.name, severity: selectedRule.severity }));

    const deviceObjects = (occurrences || []).reduce(
      (acc, { deviceId }) => ({
        ...acc,
        [deviceId]: acc[deviceId] || deviceEntities[deviceId]
      }),
      {}
    );

    const deviceIds = Object.keys(deviceObjects);
    const devices = deviceIds.map(deviceId => deviceObjects[deviceId]);
    const deviceIdString = deviceIds.sort().join(idDelimiter);
    this.setState({
        deviceIds: deviceIdString,
        devices,
        occurrences,
        selectedAlert,
        selectedRule
      },
      () => this.restartTelemetry$.next(deviceIdString)
    );
  }

  componentWillUnmount() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setTab = selectedTab => () => this.setState({ selectedTab })

  onRuleGridReady = gridReadyEvent => this.ruleGridApi = gridReadyEvent.api;
  onAlarmGridReady = gridReadyEvent => this.alarmGridApi = gridReadyEvent.api;
  onDeviceGridReady = gridReadyEvent => this.deviceGridApi = gridReadyEvent.api;

  onContextMenuChange = stateKey => contextBtns => this.setState({ [stateKey]: contextBtns });

  onHardSelectChange = gridName =>
    selectedRows => {
      if (selectedRows.length > 0) this.deselectOtherGrids(gridName);
    };

  deselectOtherGrids = gridName => {
    if (gridName !== 'rules' && this.ruleGridApi.getSelectedNodes().length > 0) {
      this.ruleGridApi.deselectAll();
    }
    if (gridName !== 'alarms' && this.alarmGridApi.getSelectedNodes().length > 0) {
      this.alarmGridApi.deselectAll();
    }
    if (gridName !== 'devices' && this.deviceGridApi.getSelectedNodes().length > 0) {
      this.deviceGridApi.deselectAll();
    }
  }

  render () {
    const {
      error,
      isPending,
      lastUpdated,
      match,
      refreshData,
      theme,
      t
    } = this.props;
    const selectedId = match.params.id;
    const rule = isPending ? undefined : [this.state.selectedRule];
    const alarmName = (this.state.selectedRule || {}).name || selectedId;

    const alarmsGridProps = {
      rowData: isPending ? undefined : this.state.occurrences,
      pagination: true,
      paginationPageSize: Config.smallGridPageSize,
      onContextMenuChange: this.onContextMenuChange('alarmContextBtns'),
      onHardSelectChange: this.onHardSelectChange('alarms'),
      onGridReady: this.onAlarmGridReady,
      t
    };

    const { selectedTab, selectedAlert = {} } = this.state;
    const { counts = {} } = selectedAlert;
    return [
      <ContextMenu key="context-menu">
        {
          this.state.ruleContextBtns
          || this.state.alarmContextBtns
          || this.state.deviceContextBtns
        }
        <RefreshBar
          refresh={refreshData}
          time={lastUpdated}
          isPending={isPending}
          t={t} />
      </ContextMenu>,
      <PageContent className="maintenance-container rule-details-container" key="page-content">
      {
        !this.props.error
          ? <div>
              <div className="header-container">
                <h1 className="maintenance-header">{alarmName}</h1>
                <div className="rule-stat-container">
                  <div className="rule-stat-cell">
                    <div className="rule-stat-header">{t('maintenance.total')}</div>
                    <div className="rule-stat-value">{renderUndefined(counts.total)}</div>
                  </div>
                  <div className="rule-stat-cell">
                    <div className="rule-stat-header">{t('maintenance.open')}</div>
                    <div className="rule-stat-value">{renderUndefined(counts.open)}</div>
                  </div>
                  <div className="rule-stat-cell">
                    <div className="rule-stat-header">{t('maintenance.acknowledged')}</div>
                    <div className="rule-stat-value">{renderUndefined(counts.acknowledged)}</div>
                  </div>
                  <div className="rule-stat-cell">
                    <div className="rule-stat-header">{t('maintenance.closed')}</div>
                    <div className="rule-stat-value">{renderUndefined(counts.closed)}</div>
                  </div>
                  <div className="rule-stat-cell">
                    <div className="rule-stat-header">{t('maintenance.lastEvent')}</div>
                    <div className="rule-stat-value">
                      {
                        selectedAlert.lastOccurrence
                          ? <TimeRenderer value={selectedAlert.lastOccurrence} />
                          : Config.emptyValue
                      }
                    </div>
                  </div>
                  <div className="rule-stat-cell">
                    <div className="rule-stat-header">{t('maintenance.severity')}</div>
                    <div className="rule-stat-value">
                      {
                        selectedAlert.severity
                          ? <SeverityRenderer context={({ t: this.props.t })} value={selectedAlert.severity} />
                          : Config.emptyValue
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className="details-description">
                { t('maintenance.ruleDetailsDesc') }
              </div>
              <h4 className="sub-heading">{ t('maintenance.ruleDetail') }</h4>
              <RulesGrid
                t={t}
                onGridReady={this.onRuleGridReady}
                onContextMenuChange={this.onContextMenuChange('ruleContextBtns')}
                onHardSelectChange={this.onHardSelectChange('rules')}
                rowData={rule}
                pagination={false} />

              <h4 className="sub-heading">{ t('maintenance.alarmOccurrences') }</h4>
              <AlarmOccurrencesGrid {...alarmsGridProps} />

              <h4 className="sub-heading">{ t('maintenance.relatedInfo') }</h4>
              <div className="tab-container">
                <button className={joinClasses('tab', selectedTab === tabIds.all ? 'active' : '')}
                    onClick={this.setTab(tabIds.all)}>{t('maintenance.all')}</button>
                <button className={joinClasses('tab', selectedTab === tabIds.devices ? 'active' : '')}
                    onClick={this.setTab(tabIds.devices)}>{t('maintenance.devices')}</button>
                <button className={joinClasses('tab', selectedTab === tabIds.telemetry ? 'active' : '')}
                    onClick={this.setTab(tabIds.telemetry)}>{t('maintenance.telemetry')}</button>
              </div>
              {
                (selectedTab === tabIds.all || selectedTab === tabIds.devices) &&
                [
                  <h4 className="sub-heading" key="header">{t('maintenance.alarmedDevices')}</h4>,
                  <DevicesGrid
                    t={t}
                    onGridReady={this.onDeviceGridReady}
                    rowData={isPending ? undefined : this.state.devices}
                    onContextMenuChange={this.onContextMenuChange('deviceContextBtns')}
                    onHardSelectChange={this.onHardSelectChange('devices')}
                    key="chart" />
                ]
              }
              {
                !isPending && (selectedTab === tabIds.all || selectedTab === tabIds.telemetry) && Object.keys(this.state.telemetry).length > 0 &&
                [
                  <h4 className="sub-heading" key="header">{t('maintenance.alarmedDeviceTelemetry')}</h4>,
                  <div className="details-chart-container" key="chart">
                    <TelemetryChart telemetry={this.state.telemetry} theme={theme} colors={chartColorObjects} />
                  </div>
                ]
              }
            </div>
          : <AjaxError t={t} error={error} />
      }
      </PageContent>
    ];
  }
}
