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
        onClick={this.props.openManageFiltersFlyout}
        value={lang.MANAGEFILTERS} />
    );
  }
}

// Connect to Redux store
const mapDispatchToProps = dispatch => {
  return {
    openManageFiltersFlyout: () => dispatch({
      type: actionTypes.FLYOUT_SHOW,
      content: { type: 'Manage Filters' }
    })
  };
};

export default connect(undefined, mapDispatchToProps)(ManageFilterBtn);
