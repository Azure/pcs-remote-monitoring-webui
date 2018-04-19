// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Btn } from 'components/shared';
import { svgs, LinkedComponent } from 'utilities';
import Flyout from 'components/shared/flyout';
import DeviceGroupForm from './views/deviceGroupForm';
import DeviceGroups from './views/deviceGroups';

import './manageDeviceGroups.css';

const Section = Flyout.Section;

export class ManageDeviceGroups extends LinkedComponent {

  constructor(props) {
    super(props);

    this.state = {
      addNewDeviceGroup: false,
      selectedDeviceGroup: undefined
    };
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
    const { onClose, t, deviceGroups = [] } = this.props;

    return (
      <Flyout.Container>
        <Flyout.Header>
          <Flyout.Title>{t('deviceGroupsFlyout.title')}</Flyout.Title>
          <Flyout.CloseBtn onClick={onClose} />
        </Flyout.Header>
        <Flyout.Content className="manage-filters-flyout-container">
          {
            this.state.addNewDeviceGroup || !!this.state.selectedDeviceGroup
              ? <DeviceGroupForm {...this.props} cancel={this.closeForm} {...this.state} />
              : <Section.Container>
                  <Btn className="add-btn" svg={svgs.plus} onClick={this.toggleNewFilter}>{t('deviceGroupsFlyout.create')}</Btn>
                  { deviceGroups.length > 0 && <DeviceGroups {...this.props} onEditDeviceGroup={this.onEditDeviceGroup}/> }
                </Section.Container>
          }
        </Flyout.Content>
      </Flyout.Container>
    );
  }
}
