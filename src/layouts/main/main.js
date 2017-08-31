// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import Header from './header.js';
import LeftNav from './leftNav.js';
import Flyout from '../../components/flyout/flyout';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './main.css';

class Main extends Component {
  render() {
    const { flyout, actions } = this.props;
    const flyoutProp = {
      show: flyout.show,
      onClose: (flyout.content && flyout.content.onClose)? flyout.content.onClose : actions.hideFlyout,
      content: flyout.content
    };
    return (
      <div className="main">
        <LeftNav onClick={this.props.actions.hideFlyout} />
        <div className="mainbody">
          <Header />
          <div className="content">
            {this.props.children}
          </div>
        </div>
        <Flyout {...flyoutProp} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    flyout: state.flyoutReducer
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
