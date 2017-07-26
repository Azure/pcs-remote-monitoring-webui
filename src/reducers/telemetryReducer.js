// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';
import initialState from './initialState';

const telemetryMap = [
  'Temperature',
  'Humidity',
  'Vibration',
  'Light',
  'Sound',
  'Motion',
  'Water level',
  'Movement'
];

const loadTelemetryChartData = () => {
  // TODO remove mock data
  const columns = [
    ['x', '2015-12-29', '2015-12-30', '2015-12-31'],
    [`Elevator1`, 230, 300, 330],
    [`Elevator2`, 190, 230, 200],
    [`Elevator3`, 90, 130, 180]
  ].map(arr =>
    arr.map(e => (typeof e === 'number' ? Math.floor(Math.random() * e) : e))
  );
  return {
    x: 'x',
    columns
  };
};

const validTelemetryType = telemetry =>
  telemetryMap.map(e => e.toUpperCase()).includes(telemetry.toUpperCase());

const telemetryReducer = (state = initialState.dashboard.telemetry, action) => {
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
      // TODO remove mock data
      const data = loadTelemetryChartData();
      return {
        ...state,
        radioBtnOptions: newOptions,
        timeline: {
          ...state.timeline,
          chartConfig: {
            ...state.timeline.chartConfig,
            data
          }
        }
      };

    case types.LOAD_TELEMETRY_BY_DEVICEGROUP_SUCCESS:
      let radioBtnOptions = {};
      action.data.forEach(item => {
        if (item.Body) {
          Object.keys(item.Body).forEach(telemetry => {
            if (validTelemetryType(telemetry)) {
              if (!radioBtnOptions[telemetry]) {
                radioBtnOptions[telemetry] = {
                  selected: false,
                  options: []
                };
              }
              const option = {
                DeviceId: item.DeviceId,
                Time: item.Time,
                telemetry,
                value: item.Body[telemetry]
              };
              radioBtnOptions[telemetry].options.push(option);
            }
          });
        }
      });
      Object.keys(radioBtnOptions).sort().forEach((key, index) => {
        if (!index) {
          radioBtnOptions[key].selected = true;
        }
      });
      // TODO: remove mock data
      const chartData = loadTelemetryChartData();
      return {
        ...state,
        telemetryByDeviceGroup: action.data,
        radioBtnOptions,
        timeline: {
          ...state.timeline,
          chartConfig: {
            ...state.timeline.chartConfig,
            data: chartData
          }
        }
      };

    default:
      return state;
  }
};

export default telemetryReducer;
