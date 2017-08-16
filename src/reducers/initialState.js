// Copyright (c) Microsoft. All rights reserved.

export default {
  filter: {
    deviceGroups: []
  },
  dashboard: {
    map: {},
    telemetry: {
      timeline: {
        chartConfig: {
          bindto: '',
          data: {
            json: [],
            xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
            keys: {
              x: 'Time',
              value: []
            }
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                rotate: 65,
                format: '%Y-%m-%dT%H:%M:%S'
              }
            }
          },
          zoom: {
            enabled: true
          },
          line: {
            connectNull: true
          }
        }
      }
    },
    devices: {},
    kpi: {},
    messages: []
  },
  flyout: {
    show: false
  }
};
