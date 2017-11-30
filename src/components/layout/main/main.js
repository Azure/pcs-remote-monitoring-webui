// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions';
import LeftNav from '../leftNav/leftNav.js';
import Flyout from '../../flyout/flyout';
import PcsModal from '../../shared/pcsModal/pcsModal';
import lang from '../../../common/lang';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './main.css';

/**
 * Contains the main layout of the application (main nav on the left, content on the right).
 * This component is meant to be used in conjunction with the router.
 */
class Main extends Component {
  componentDidMount() {
    this.props.actions.loadDevices();

    // On the first page load, open a modal to direct the user to more information
    this.props.actions.showModal(
      lang.PREVIEWNOTICE,
      'https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/blob/master/README.md'
    );
  }

  render() {
    const { flyout, actions, modal } = this.props;
    const flyoutProp = {
      show: flyout.show,
      onClose: (flyout.content && flyout.content.onClose) ? flyout.content.onClose : actions.hideFlyout,
      content: flyout.content
    };

    return (
      <div className="main-container">
        <LeftNav onClick={this.props.actions.hideFlyout} />
        <div className="main-content-container">
          {this.props.children}
        </div>
        <Flyout {...flyoutProp} />
        {
          modal.visible
            ? <PcsModal to={modal.to}>{modal.content}</PcsModal>
            : ''
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(Main);
