// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import * as actions from '../../../actions';

import CloseSvg from '../../../assets/icons/Cancel.svg';

import './pcsModal.css';

class PcsModal extends Component {
  render() {
    const { actions, children, to } = this.props;
    const linkProps = {
      to,
      className: 'pcs-modal-clickable-container',
      onClick: actions.hideModal
    };

    // If navigating to an absolute url, open the url in a new window
    if ((to || '').startsWith('http')) {
      linkProps.target = '_blank';
    }

    return (
      <div className="pcs-modal-container">
        <div className="pcs-modal-close">
          <span className="pcs-modal-close-btn" onClick={actions.hideModal}>
            <img src={CloseSvg} alt="Modal icon" />
          </span>
        </div>
        <Link {...linkProps}>
          <div className="pcs-modal-content">{children}</div>
        </Link>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(null, mapDispatchToProps)(PcsModal);
