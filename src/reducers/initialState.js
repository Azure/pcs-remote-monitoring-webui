// Copyright (c) Microsoft. All rights reserved.

const chartConfig = {
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
};

export default {
  deviceGroupFilters:{},
  deviceGroups: [],
  devices: {},
  selectedDeviceGroupId: '',
  alarmsList: [],
  telemetry: {
    timeline: {
      chartConfig
    }
  },
  dashboard: {
    map: {},
    kpi: {
      chartDataFetchComplete: false,
      alarmsList: []
    }
  },
  flyout: {
    show: false
  },
  modal: {
    visible: false
  },
  maintenance: {},
  indicator: {
    map: false,
    telemetry: false,
    kpi: false,
    alarms: false
  }
};
