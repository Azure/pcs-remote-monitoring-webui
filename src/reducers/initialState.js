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
          bindto: '#timeline',
          data: {
            x: 'x',
            columns: []
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                rotate: 0,
                format: '%Y-%m-%d'
              }
            }
          },
          zoom: {
            enabled: true
          }
        },
        chartId: 'timeline'
      }
    },
    devices: {},
    messages: []
  },
  flyout: {
    show: false
  }
};
