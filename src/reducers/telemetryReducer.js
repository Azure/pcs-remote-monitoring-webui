// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';
import initialState from './initialState';

const validTelemetryType = (telemetry, telemetryTypes) =>
  telemetryTypes.map(e => e.toUpperCase()).includes(telemetry.toUpperCase());

const getLatestTimestamp = data =>
  Math.max.apply(null, data.map(e => new Date(e.Time)));

const telemetryReducer = (state = initialState.telemetry, action) => {
  let radioBtnOptions = {};
  let chartDataSelected = [];
  let displayNames = [];
  let telemetrytypes = [];
  let selectedTelemetry = '';
  switch (action.type) {
    case types.LOAD_TELEMETRY_TYPES_SUCCESS:
      return {
        ...state,
        telemetryTypes: action.data
      };

    case types.SELECT_TELEMETRY_TYPE:
      let newOptions = Object.assign({}, state.radioBtnOptions);
      Object.keys(newOptions).forEach(key => {
        action.key === key
          ? (newOptions[key].selected = true)
          : (newOptions[key].selected = false);
      });
      return {
        ...state,
        radioBtnOptions: newOptions,

        timeline: {
          ...state.timeline,
          selectedTelemetry: action.key,
          chartConfig: {
            ...state.timeline.chartConfig,
            data: {
              ...state.timeline.chartConfig.data,
              json: newOptions[action.key].chartData,
              keys: {
                ...state.timeline.chartConfig.data.keys,
                value: newOptions[action.key].deviceNames
              }
            }
          }
        }
      };

    case types.LOAD_TELEMETRY_MESSAGES_SUCCESS:
      telemetrytypes = action.data.Properties.filter(e => !e.includes('_'));
      action.data.Items.forEach(item => {
        if (item.Data) {
          Object.keys(item.Data).forEach(telemetry => {
            if (validTelemetryType(telemetry, telemetrytypes)) {
              if (!radioBtnOptions[telemetry]) {
                radioBtnOptions[telemetry] = {
                  selected: false,
                  chartData: [],
                  deviceNames: []
                };
              }
              const option = {};
              const deviceName = item.DeviceId.split('.').join('_');
              option[deviceName] = item.Data[telemetry];
              option['Time'] = new Date(item.Time).toISOString();
              radioBtnOptions[telemetry].chartData.push(option);
              if (
                radioBtnOptions[telemetry].deviceNames.every(
                  e => e !== deviceName
                )
              ) {
                radioBtnOptions[telemetry].deviceNames.push(deviceName);
              }
            }
          });
        }
      });
      Object.keys(radioBtnOptions).sort().forEach((key, index) => {
        if (!index) {
          radioBtnOptions[key].selected = true;
          selectedTelemetry = key;
          chartDataSelected = [].concat(radioBtnOptions[key].chartData);
          displayNames = [].concat(radioBtnOptions[key].deviceNames);
        }
      });
      return {
        ...state,
        telemetryByDeviceGroup: action.data,
        radioBtnOptions,
        timeline: {
          ...state.timeline,
          selectedTelemetry,
          chartConfig: {
            ...state.timeline.chartConfig,
            data: {
              ...state.timeline.chartConfig.data,
              json: chartDataSelected,
              keys: {
                ...state.timeline.chartConfig.data.keys,
                value: displayNames
              }
            }
          }
        }
      };

    case types.UPDATE_TELEMETRY_TYPES_SUCCESS:
      if (!action.data || !action.data.Items || !action.data.Items.length) {
        return { ...state };
      }

      const currentSelectedTelemetry = state.timeline.selectedTelemetry || Object.keys(state.radioBtnOptions || {}).sort()[0];
      let latestTimestamp = 0;
      telemetrytypes = action.data.Properties.filter(e => !e.includes('_'));
      action.data.Items.forEach(item => {
        if (item.Data) {
          Object.keys(item.Data).forEach(telemetry => {
            if (validTelemetryType(telemetry, telemetrytypes)) {
              if (!radioBtnOptions[telemetry]) {
                radioBtnOptions[telemetry] = {
                  selected: false,
                  chartData: [],
                  deviceNames: []
                };
              }
              if (currentSelectedTelemetry === telemetry) {
                radioBtnOptions[currentSelectedTelemetry].selected = true;
              }
              const option = {};
              const deviceName = item.DeviceId.split('.').join('_');
              option[deviceName] = item.Data[telemetry];
              option['Time'] = new Date(item.Time).toISOString();
              if (
                !radioBtnOptions[telemetry].chartData.some(
                  e =>
                    e.Time === option.Time && e.deviceName === option.deviceName
                )
              ) {
                radioBtnOptions[telemetry].chartData.push(option);
              }
              if (
                radioBtnOptions[telemetry].deviceNames.every(
                  e => e !== deviceName
                )
              ) {
                radioBtnOptions[telemetry].deviceNames.push(deviceName);
              }
            }
          });
        }
      });
      chartDataSelected = [].concat(
        (radioBtnOptions[currentSelectedTelemetry] || {}).chartData
      );
      if (currentSelectedTelemetry && chartDataSelected.length) {
        latestTimestamp = getLatestTimestamp(
          state.radioBtnOptions[currentSelectedTelemetry].chartData
        );
        chartDataSelected = chartDataSelected.filter(
          e => new Date(e.Time) > latestTimestamp
        );
      }
      // TODO: filter by timestamp?

      displayNames = [].concat(
        (radioBtnOptions[currentSelectedTelemetry] || {}).deviceNames
      );
      return {
        ...state,
        telemetryByDeviceGroup: action.data,
        radioBtnOptions,
        timeline: {
          ...state.timeline,
          selectedTelemetry: currentSelectedTelemetry,
          chartConfig: {
            ...state.timeline.chartConfig,
            data: {
              ...state.timeline.chartConfig.data,
              json: chartDataSelected,
              keys: {
                ...state.timeline.chartConfig.data.keys,
                value: displayNames
              }
            }
          }
        }
      };

    default:
      return state;
  }
};

export default telemetryReducer;
