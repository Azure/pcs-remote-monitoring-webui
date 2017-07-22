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
        if (action.key === key) {
          newOptions[key].selected = true;
        } else {
          newOptions[key].selected = false;
          newOptions[key].subMenu = false;
        }
      });
      return {
        ...state,
        radioBtnOptions: newOptions
      };

    case types.TOGGLE_TELEMETRY_TYPE_SUBMENU:
      let nextOptions = Object.assign({}, state.radioBtnOptions);
      Object.keys(nextOptions).forEach(key => {
        if (action.key === key) {
          nextOptions[key].subMenu = !nextOptions[key].subMenu;
        } else {
          nextOptions[key].subMenu = false;
        }
      });
      return {
        ...state
      };

    case types.LOAD_TELEMETRY_BY_DEVICEGROUP_SUCCESS:
      let radioBtnOptions = {};
      action.data.forEach(item => {
        console.log(item);
        if (item.Body) {
          Object.keys(item.Body).forEach(telemetry => {
            if (validTelemetryType(telemetry)) {
              if (!radioBtnOptions[telemetry]) {
                radioBtnOptions[telemetry] = {
                  selected: false,
                  subMenu: false,
                  options: []
                };
              }
              const option = {
                DeviceId: item.DeviceId,
                Time: item.Time,
                telemetry
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
      return {
        ...state,
        telemetryByDeviceGroup: action.data,
        radioBtnOptions
      };

    default:
      return state;
  }
};

export default telemetryReducer;
