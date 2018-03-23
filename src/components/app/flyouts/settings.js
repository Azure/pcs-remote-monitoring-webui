// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Flyout from 'components/shared/flyout';

import './settings.css';

const Section = Flyout.Section;

export class Settings extends Component {
  render() {
    const { t, onClose, theme, changeTheme, version } = this.props;
    const nextTheme = theme === 'dark' ? 'light': 'dark';
    return (
      <Flyout.Container>
        <Flyout.Header>
          <Flyout.Title>{ t('settingsFlyout.title') }</Flyout.Title>
          <Flyout.CloseBtn onClick={onClose} />
        </Flyout.Header>
        <Flyout.Content className="settings-workflow-container">

          <Section.Container collapsable={false} className="app-version">
            <Section.Header>{ t('settingsFlyout.version', { version }) }</Section.Header>
            <Section.Content>{ t('settingsFlyout.viewRelNotes') }</Section.Content>
          </Section.Container>

          <Section.Container>
            <Section.Header>{ t('settingsFlyout.theme') }</Section.Header>
            <Section.Content>
              { t('settingsFlyout.changeTheme') }

              <button onClick={() => changeTheme(nextTheme)} className="toggle-theme-btn">
                { t('settingsFlyout.switchTheme', { nextTheme }) }
              </button>
            </Section.Content>
          </Section.Container>

        </Flyout.Content>
      </Flyout.Container>
    );
  }
}
