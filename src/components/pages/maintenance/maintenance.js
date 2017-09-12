// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';

import PageContainer from '../../layout/pageContainer/pageContainer.js';
import PageContent from '../../layout/pageContent/pageContent.js';
import TopNav from '../../layout/topNav/topNav.js';
import ContextFilters from '../../layout/contextFilters/contextFilters.js';
import * as actions from '../../../actions';
import MaintenanceWidget from '../../maintenance/maintenanceWidget';
import lang from '../../../common/lang';

class MaintenancePage extends Component {

  componentDidMount() {
    const { actions } = this.props;
    actions.loadDevicesByTelemetryMessages();
  }

  render() {
    return (
      <PageContainer>
        <TopNav breadcrumbs={'Devices'} projectName={lang.DASHBOARD.AZUREPROJECTNAME} />
        <ContextFilters></ContextFilters>
        <PageContent>
          <Grid fluid className="layout">
            <Row className="widgets rowH100Percent">
              <Col md={12}>
                <MaintenanceWidget alarms={this.props.alarmList} />
              </Col>
            </Row>
          </Grid>
        </PageContent>
      </PageContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    alarmList: state.deviceReducer.alarmsList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MaintenancePage);
