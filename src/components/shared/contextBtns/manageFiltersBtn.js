// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../../actions/actionTypes';
import lang from '../../../common/lang';
import PcsBtn from '../../shared/pcsBtn/pcsBtn';
import ManageFiltersSvg from '../../../assets/icons/ManageFilters.svg';

class ManageFilterBtn extends Component {
  render() {
    return (
      <PcsBtn
        svg={ManageFiltersSvg}
        onClick={this.props.openManageFiltersFlyout.bind(this, this.props.deviceGroups)}
        value={lang.MANAGEFILTERS} />
    );
  }
}

// Connect to Redux store
const mapDispatchToProps = dispatch => {
  return {
    openManageFiltersFlyout: deviceGroups => dispatch({
      type: actionTypes.FLYOUT_SHOW,
      content: { type: 'Manage Filters', deviceGroups }
    })
  };
};

const mapStateToProps = state => ({
  deviceGroups: state.filterReducer.deviceGroups
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageFilterBtn);
