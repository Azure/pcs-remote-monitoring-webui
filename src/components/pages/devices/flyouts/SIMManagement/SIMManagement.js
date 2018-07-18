// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom'

import { permissions } from 'services/models';
import { LinkedComponent } from 'utilities';
import { FormControl, Protected } from 'components/shared';
import Flyout from 'components/shared/flyout';

import './SIMManagement.css';

const Section = Flyout.Section;

const simManagementUrl = 'https://iot.telefonica.com/contact';

const optionValues = [
  { value: 'telefonica' }
];

export class SIMManagement extends LinkedComponent {

  constructor(props) {
    super(props);

    this.state = {
      provider: ''
    };

    this.providerLink = this.linkTo('provider')
      .map(({ value }) => value);
  }

  render() {
    const { t, onClose } = this.props;
    const { provider } = this.state;

    const options = optionValues.map(({ value }) => ({
      label: t(`devices.flyouts.SIMManagement.operator.${value}`),
      value
    }));

    return (
      <Flyout.Container>
        <Flyout.Header>
          <Flyout.Title>{t('devices.flyouts.SIMManagement.title')}</Flyout.Title>
          <Flyout.CloseBtn onClick={onClose} />
        </Flyout.Header>
        <Flyout.Content className="sim-management-container">
          <Protected permission={permissions.updateSIMManagement}>
            <div className="sim-management-selector">
              <div className="sim-management-label-selector">{t(`devices.flyouts.SIMManagement.provider`)}</div>
              <div className="sim-management-dropdown">
                <FormControl
                  type="select"
                  className="sim-management-dropdown"
                  options={options}
                  searchable={false}
                  clearable={false}
                  placeholder={t('devices.flyouts.SIMManagement.select')}
                  link={this.providerLink} />
              </div>
            </div>
            {
              !!provider &&
              <Section.Container className="hide-border" collapsable={false}>
                <Section.Header>{t(`devices.flyouts.SIMManagement.summaryHeader`)}</Section.Header>
                <Section.Content>
                  <div>{t(`devices.flyouts.SIMManagement.header.${provider}`)}</div>
                  <div className="sim-management-label-desctiption">
                    <Trans i18nKey={`devices.flyouts.SIMManagement.description.${provider}`}>
                      Feature is... <Link to={simManagementUrl} target="_blank">{t(`devices.flyouts.SIMManagement.here`)}</Link> ...your account.
                    </Trans>
                  </div>
                </Section.Content>
              </Section.Container>
            }
          </Protected>
        </Flyout.Content>
      </Flyout.Container>
    );
  }
}
