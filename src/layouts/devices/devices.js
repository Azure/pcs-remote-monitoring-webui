// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import { Grid, Row, Col } from 'react-bootstrap';
import DeviceList from '../../components/deviceList/deviceList';
import Flyout from '../../components/flyout/flyout';

import '../layout.css';

class Devices extends Component {
  render() {
    const { flyout, actions } = this.props;
    const flyoutProp = {
      show: flyout.show,
      onClose: actions.hideFlyout,
      content: flyout.content
    };
    return (
      <Grid fluid className="layout">
        <Row className="widgets rowH100Percent">
          <Col md={12}>
            <DeviceList />
          </Col>
        </Row>
        <Flyout {...flyoutProp} />
      </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(Devices);
