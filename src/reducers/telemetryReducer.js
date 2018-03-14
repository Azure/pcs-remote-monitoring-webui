// Copyright (c) Microsoft. All rights reserved.

import moment from 'moment';
import * as types from '../actions/actionTypes';
import initialState from './initialState';
import Config from '../common/config';
import { getStandardTimeFormat } from '../common/utils';

const validTelemetryType = (telemetry, telemetryTypes) =>
  telemetryTypes.map(e => e.toUpperCase()).includes(telemetry.toUpperCase());

// Filter chart data by telemetry slide window (15 minutes)
const filterByTimestamp = (radioBtnOptions) => {
  const newOptions = Object.assign({}, radioBtnOptions);
  Object.keys(radioBtnOptions).forEach(key => {
    if(radioBtnOptions[key].chartData && radioBtnOptions[key].chartData.length > 0) {
      const filterTimestamp = moment().subtract(Config.INTERVALS.TELEMETRY_SLIDE_WINDOW_MIN, 'minute').valueOf();
      newOptions[key].chartData = newOptions[key].chartData.filter(e => new Date(e.Time) > filterTimestamp)
    }
  });
  return newOptions;
}

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
              const deviceName = item.DeviceId.split('.').join('-');
              const option = {
                [deviceName]: item.Data[telemetry],
                Time: getStandardTimeFormat(item.Time)
              };
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
      telemetrytypes = action.data.Properties.filter(e => !e.includes('_'));
      radioBtnOptions = Object.assign({}, state.radioBtnOptions);
      const newData = {};
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
              const deviceName = item.DeviceId.split('.').join('-');
              const option = {
                [deviceName]: item.Data[telemetry],
                Time: getStandardTimeFormat(item.Time)
              };
              const isNewData = !radioBtnOptions[telemetry].chartData.some(e => e.Time === option.Time && e.deviceName === option.deviceName);
              const isNewDevice = radioBtnOptions[telemetry].deviceNames.every(e => e !== deviceName);
              if (isNewData) {
                radioBtnOptions[telemetry].chartData.push(option);
                if (!newData[telemetry]) {
                  newData[telemetry] = [];
                }
                newData[telemetry].push(option);
              }
              if (isNewDevice) {
                radioBtnOptions[telemetry].deviceNames.push(deviceName);
              }
            }
          });
        }
      });
      const newChartData = newData[currentSelectedTelemetry] || [];

      displayNames = [].concat(
        (radioBtnOptions[currentSelectedTelemetry] || {}).deviceNames
      );
      return {
        ...state,
        telemetryByDeviceGroup: action.data,
        radioBtnOptions: filterByTimestamp(radioBtnOptions),
        newData,
        timeline: {
          ...state.timeline,
          selectedTelemetry: currentSelectedTelemetry,
          chartConfig: {
            ...state.timeline.chartConfig,
            data: {
              ...state.timeline.chartConfig.data,
              json: newChartData,
              keys: {
                ...state.timeline.chartConfig.data.keys,
                value: displayNames
              }
            }
          }
        }
      };

    case types.TELEMETRY_ERROR:
      return {
        ...state,
        error: action.error
      };

    default:
      return state;
  }
};

export default telemetryReducer;
