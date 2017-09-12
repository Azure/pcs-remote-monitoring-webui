// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../../actions/actionTypes';
import { getRegionByDisplayName, loadRegionSpecificDevices } from '../../../actions/filterActions';
import Select from 'react-select';

import Filter from '../../../assets/icons/Filter.svg';

import './contextFilters.css';

class ContextFilters extends Component {

  constructor() {
    super();
    // On intial load we show 'All devices' as the group filter and set id as 0.
    this.state = { selectedGroupId: 0 };
    this.updateValue = this.updateValue.bind(this);
  }

  componentDidMount() {
    this.props.loadRegions();
  }

  updateValue(newValue) {
    this.setState({ selectedGroupId: newValue });
    this.props.deviceGroupChanged(newValue, this.props.deviceGroups);
  }

  render() {
    const deviceGroups = this.props.deviceGroups || [];
    let options = deviceGroups.map(group => {
      return { value: group.Id, label: group.DisplayName };
    });
    options = [{ value: 0, label: 'All Devices' }].concat(options);
    return (
      <div className="context-filter-container">
        <div className="device-group-filter">
          <img className="filter-icon" src={Filter} alt="Filter" />
          <div className="select-container">
            <Select
              className="top-nav-filters"
              autofocus
              options={options}
              value={this.state.selectedGroupId}
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
  loadRegions: () => {
    dispatch(getRegionByDisplayName());
  },

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
  deviceGroups: state.filterReducer.deviceGroups
});

export default connect(mapStateToProps, mapDispatchToProps)(ContextFilters);
