// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions';

import './pageContent.css';

class PageContent extends Component {
  render() {
    return (
      <div className={`page-content ${this.props.className || ''}`} onClick={this.props.actions.hideFlyout}>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    flyout: state.flyoutReducer,
    modal: state.modalReducer
  };
};

const mapDispatchToProps = dispatch => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageContent);
