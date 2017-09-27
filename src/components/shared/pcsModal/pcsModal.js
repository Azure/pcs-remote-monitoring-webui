// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions';

import CloseSvg from '../../../assets/icons/Cancel.svg';

import './pcsModal.css';

class PcsModal extends Component {
  render() {
    const { actions, svg, children } = this.props;
    return (
      <div className="pcs-modal-container">
        <div className="pcs-modal-close">
          <span className="pcs-moda-close-btn" onClick={actions.hideModal}>
            <img src={CloseSvg} alt="Modal icon" />
          </span>
        </div>
        <div className="pcs-modal-clickable-container">
          {svg ? <div className="pcs-modal-icon"><img src={svg} alt="Modal icon" /></div> : ''}
          <div className="pcs-modal-content">{children}</div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(null, mapDispatchToProps)(PcsModal);
