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
                rotate: 0,
                format: '%H:%M:%S'
              }
            }
          },
          tooltip: {
            format: {
              title: d => d
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
    kpi: {
      chartDataFetchComplete: false,
      alarmsList: []
    },
    messages: []
  },
  flyout: {
    show: false
  }
};
