// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Trans } from 'react-i18next';

import { permissions } from 'services/models';

import { LinkedComponent, svgs } from 'utilities';

import {
  FormControl,
  Btn,
  BtnToolbar,
  Protected,
  Hyperlink
} from 'components/shared';

import Flyout from 'components/shared/flyout';

import './SIMManagement.scss';

const Section = Flyout.Section;

const simManagementUrl = 'https://iot.telefonica.com/contact';

const optionValues = [
  { value: 'telefonica' }
];

export class SIMManagement extends LinkedComponent {

  constructor(props) {
    super(props);

    this.state = {
      provider: '',
      isPending: false
    };

    this.providerLink = this.linkTo('provider').map(({ value }) => value);
  }

  showProvider = () => this.setState({ isPending: true });

  render() {
    const { t, onClose } = this.props;
    const { provider, isPending } = this.state;

    const options = optionValues.map(({ value }) => ({
      label: t(`devices.flyouts.SIMManagement.operator.${value}`),
      value
    }));

    return (
      <Flyout.Container header={t('devices.flyouts.SIMManagement.title')} t={t} onClose={onClose}>
        <div className="sim-management-container">
          <Protected permission={permissions.updateSIMManagement}>
            <div className="sim-management-selector">
              <div className="sim-management-label-selector">{t(`devices.flyouts.SIMManagement.provider`)}</div>
              <div className="sim-management-dropdown">
                <FormControl
                  type="select"
                  ariaLabel={t(`devices.flyouts.SIMManagement.provider`)}
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
                      Feature is... <Hyperlink href={simManagementUrl} target="_blank">{t(`devices.flyouts.SIMManagement.here`)}</Hyperlink> ...your account.
                    </Trans>
                  </div>
                </Section.Content>
              </Section.Container>
            }
            <BtnToolbar>
              {!isPending && <Btn primary={true} disabled={!provider} onClick={this.showProvider} type="submit">{t('devices.flyouts.new.apply')}</Btn>}
              <Btn svg={svgs.cancelX} onClick={onClose}>{isPending ? t('devices.flyouts.new.close') : t('devices.flyouts.new.cancel')}</Btn>
            </BtnToolbar>
          </Protected>
        </div>
      </Flyout.Container>
    );
  }
}
