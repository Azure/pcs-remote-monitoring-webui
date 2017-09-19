// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Filter from '../../assets/icons/Filter.svg';
import * as actionTypes from '../../actions/actionTypes';
import Lang from '../../common/lang';
import ManageFilters from '../../assets/icons/ManageFilters.svg';
import { getRegionByDisplayName, loadRegionSpecificDevices } from '../../actions/filterActions';
import './TopNavFilter.css';
import Select from 'react-select';

class TopNavFilter extends Component {
  constructor() {
    super();
    this.state = {
      selectedGroupId: 0 // On intial load we show 'All dveices' as the group filter and set id as 0.
    };
    this.updateValue = this.updateValue.bind(this);
  }

  componentDidMount() {
    this.props.loadRegions();
  }

  updateValue(newValue) {
    this.setState({
      selectedGroupId: newValue
    });
    this.props.deviceGroupChanged(newValue, this.props.deviceGroups);
  }

  render() {
    const deviceGroups = this.props.deviceGroups || [];
    let options = deviceGroups.map((group, idx) => {
      return {
        value: group.Id,
        label: group.DisplayName
      };
    });
    options = [{ value: 0, label: 'All Devices' }].concat(options);
    return (
      <div className="fliter-wrapper">
        <img className="filter" src={Filter} alt="Filter" />
        <span>
          <Select
            className="top-nav-filters"
            autofocus
            options={options}
            value={this.state.selectedGroupId}
            onChange={this.updateValue}
            simpleValue
            searchable={true}
          />
        </span>
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
  }
});

const mapStateToProps = state => ({
  deviceGroups: state.filterReducer.deviceGroups
});

export default connect(mapStateToProps, mapDispatchToProps)(TopNavFilter);
