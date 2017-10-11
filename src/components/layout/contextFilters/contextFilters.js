// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import * as actionTypes from '../../../actions/actionTypes';
import { getRegionByDisplayName, loadRegionSpecificDevices } from '../../../actions/filterActions';
import FilterSvg from '../../../assets/icons/Filter.svg';
import lang from '../../../common/lang';

import './contextFilters.css';

class ContextFilters extends Component {

  constructor(props) {
    super(props);

    this.updateValue = this.updateValue.bind(this);
  }

  componentDidMount() {
    // Only load the regions if no default device group is selected
    // since that means the regions haven't been loaded yet
    if (!this.props.selectedDeviceGroupId) {
      this.props.loadRegions();
    }
  }

  updateValue(selectedGroupId) {
    if (selectedGroupId !== this.props.selectedDeviceGroupId) {
      this.props.deviceGroupChanged(selectedGroupId, this.props.deviceGroups)
    }
  }

  render() {
    const { deviceGroups, disableDeviceFilter }  = this.props;
    const options = (deviceGroups || []).map(group => {
      return { value: group.Id, label: group.DisplayName };
      // The localeCompare() method returns a number indicating whether a reference string comes before or
      // after or is the same as the given string in sort order.
    }).sort((a , b) => a.label.localeCompare(b.label));
    const disabledClass = disableDeviceFilter ? 'disabled' : '';
    const optionProps = disableDeviceFilter
      ? {
          value: lang.DISABLED_FILTER,
          options: [{
            value: lang.DISABLED_FILTER,
            label: lang.DISABLED_FILTER
          }]
        }
      : {
          value: this.props.selectedDeviceGroupId,
          options
        };

    return (
      <div className="context-filter-container">
        <div className="device-group-filter">
          <img src={FilterSvg} alt="Filter" className={`filter-icon ${disabledClass}`} />
          <div className={`select-container ${disabledClass}`}>
            <Select
              className="top-nav-filters"
              autofocus
              {...optionProps}
              disabled={disableDeviceFilter}
              onChange={this.updateValue}
              simpleValue
              searchable={true}
            />
          </div>
        </div>
        <div className="dynamic-filters-container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadRegions: () => dispatch(getRegionByDisplayName()),

  deviceGroupChanged: (selectedGroupId, deviceGroups) => {
    let selectedGroupConditions;
    deviceGroups.some(group => {
      if (group.Id === selectedGroupId) {
        selectedGroupConditions = group.Conditions;
        return true;
      }
      return false;
    });
    dispatch(loadRegionSpecificDevices(selectedGroupConditions ? selectedGroupConditions : [], selectedGroupId));
  },

  showManageFiltersFlyout: deviceGroups => {
    dispatch({
      type: actionTypes.FLYOUT_SHOW,
      content: {
        type: 'Manage Filters',
        deviceGroups
      }
    });
  }
});

const mapStateToProps = state => ({
  deviceGroups: state.filterReducer.deviceGroups,
  selectedDeviceGroupId: state.filterReducer.selectedDeviceGroupId
});

export default connect(mapStateToProps, mapDispatchToProps)(ContextFilters);
