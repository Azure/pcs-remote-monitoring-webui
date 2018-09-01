// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { IoTHubManagerService } from 'services';
import { permissions } from 'services/models';
import { Btn, Protected } from 'components/shared';
import { svgs, LinkedComponent } from 'utilities';
import Flyout from 'components/shared/flyout';
import DeviceGroupForm from './views/deviceGroupForm';
import DeviceGroups from './views/deviceGroups';

import './manageDeviceGroups.css';

const toOption = (value, label) => ({
  label: label || value,
  value
});

export class ManageDeviceGroups extends LinkedComponent {

  constructor(props) {
    super(props);

    this.state = {
      addNewDeviceGroup: false,
      selectedDeviceGroup: undefined,
      filterOptions: [],
      filtersError: undefined
    };
  }

  componentDidMount() {
    this.subscription = IoTHubManagerService.getDeviceProperties()
      .subscribe(
        (items) => {
          const filterOptions = items.map(item => toOption(item));
          this.setState({ filterOptions });
        },
        filtersError => this.setState({ filtersError })
      );
  }

  componentWillUnmount() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  toggleNewFilter = () => this.setState({ addNewDeviceGroup: !this.state.addNewDeviceGroup });

  closeForm = () => this.setState({
    addNewDeviceGroup: false,
    selectedDeviceGroup: undefined
  });

  onEditDeviceGroup = selectedDeviceGroup => () => this.setState({
    selectedDeviceGroup
  });

  render() {
    const { closeFlyout, t, deviceGroups = [] } = this.props;

    return (
      <Flyout.Container>
        <Flyout.Header>
          <Flyout.Title>{t('deviceGroupsFlyout.title')}</Flyout.Title>
          <Flyout.CloseBtn onClick={closeFlyout} />
        </Flyout.Header>
        <Flyout.Content className="manage-filters-flyout-container">
          {
            this.state.addNewDeviceGroup || !!this.state.selectedDeviceGroup
              ? <DeviceGroupForm {...this.props} {...this.state} cancel={this.closeForm} />
              : <div>
                <Protected permission={permissions.createDeviceGroups}>
                  <Btn className="add-btn" svg={svgs.plus} onClick={this.toggleNewFilter}>{t('deviceGroupsFlyout.create')}</Btn>
                </Protected>
                {deviceGroups.length > 0 && <DeviceGroups {...this.props} onEditDeviceGroup={this.onEditDeviceGroup} />}
              </div>
          }
        </Flyout.Content>
      </Flyout.Container>
    );
  }
}
