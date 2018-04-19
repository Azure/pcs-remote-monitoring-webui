// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Btn } from 'components/shared';
import {
  PropertyGrid as Grid,
  PropertyGridBody as GridBody,
  PropertyGridHeader as GridHeader,
  PropertyRow as Row
} from 'components/pages/devices/flyouts/deviceDetails/propertyGrid';

import Flyout from 'components/shared/flyout';
const Section = Flyout.Section;

class DeviceGroups extends Component {
  render() {
    const { t, deviceGroups, onEditDeviceGroup } = this.props;

    return (
      <Section.Container>
        <Section.Content className="device-grops-grid-container">
          <Grid>
            <GridHeader>
              <Row>
                {t('deviceGroupsFlyout.deviceGroupName')}
              </Row>
            </GridHeader>
            <GridBody>
            {
              deviceGroups.map((deviceGroup, idx) =>
                <Row key={idx}>
                  <Btn onClick={onEditDeviceGroup(deviceGroup)}>
                    {deviceGroup.displayName}
                  </Btn>
                </Row>
              )
            }
            </GridBody>
          </Grid>
        </Section.Content>
      </Section.Container>
    );
  }
}

export default DeviceGroups;
