// Copyright (c) Microsoft. All rights reserved.

import React, { Component }  from 'react';

import { Btn } from 'components/shared';
import { svgs } from 'utilities';
import { toDiagnosticsModel } from 'services/models';

export class ManageDeviceGroupsBtn extends Component {

  onClick = () => {
    this.props.logEvent(toDiagnosticsModel('DeviceGroupManage_Click', {}));
    this.props.openFlyout();
  }

  render() {
    return (
      <Btn svg={svgs.manageFilters} onClick={this.onClick}>
        {this.props.t('deviceGroupsFlyout.title')}
      </Btn>
    );
  }
}
