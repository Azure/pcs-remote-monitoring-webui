// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Trans } from 'react-i18next';
import dot from 'dot-object';

import { themedPaths } from 'utilities';
import { ErrorMsg, Hyperlink, Indicator, ThemedSvgContainer } from 'components/shared';

import './actionEmailSetup.scss';

export class ActionEmailSetup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clickedSetup: false
    }

    if (!props.actionSettingsIsPending) {
      this.props.fetchActionSettings()
    }
  }

  clickedSetup = () => {
    this.props.pollActionSettings();
    this.setState({
      clickedSetup: true
    })
  }

  render() {
    const {
      t,
      actionSettings = {},
      actionSettingsIsPending,
      actionSettingsError,
      actionIsPolling,
      actionPollingTimeout,
      applicationPermissionsAssigned
    } = this.props;

    const { clickedSetup } = this.state;

    const actionsEmailIsEnabled = dot.pick('Email.isEnabled', actionSettings);
    const actionsEmailSetupUrl = dot.pick('Email.settings.office365ConnectorUrl', actionSettings);

    const showPending = clickedSetup && (actionSettingsIsPending || actionIsPolling);
    const showError = !showPending && !!actionSettingsError;

    const showSetupLink = !showPending && !showError && !actionsEmailIsEnabled && !actionPollingTimeout;
    const showSetupIncomplete = !showPending && !showError && !actionsEmailIsEnabled && actionPollingTimeout;
    const showSetupComplete =  clickedSetup && !showPending && !showError && actionsEmailIsEnabled;

    // Only show setup information if the application was deployed as owner,
    // as if it was not cannot verify whether or not setup is complete.
    // Also only show verification of setup if setup button was clicked.
    return (
      applicationPermissionsAssigned
      ? <div className="action-email-setup-container">
        {
          showPending &&
          <div className="action-email-setup">
            <Indicator className="action-indicator" size="small" />
            <div className="info-message">{t('rules.flyouts.ruleEditor.actions.checkingEmailSetup')}</div>
          </div>
        }
        {
          showError &&
          <div className="action-email-setup">
            <ErrorMsg>
              <Trans i18nKey={`rules.flyouts.ruleEditor.actions.setupEmailError`}>
                An error occurred.
                <Hyperlink href={actionsEmailSetupUrl} onClick={this.clickedSetup} target="_blank">{t('rules.flyouts.ruleEditor.actions.tryAgain')}</Hyperlink>
              </Trans>
            </ErrorMsg>
          </div>
        }
        {
          showSetupLink &&
          <div className="action-email-setup">
            <ThemedSvgContainer className="icon" paths={themedPaths.infoBubble} />
            <div className="info-message">
              <Trans i18nKey={`rules.flyouts.ruleEditor.actions.setupEmail`}>
                To send email alerts,
                <Hyperlink href={actionsEmailSetupUrl} onClick={this.clickedSetup} target="_blank">{t('rules.flyouts.ruleEditor.actions.outlookLogin')}</Hyperlink>
                is required.
              </Trans>
            </div>
          </div>
        }
        {
          showSetupIncomplete &&
          <div className="action-email-setup">
            <ThemedSvgContainer className="icon" paths={themedPaths.infoBubble} />
            <div className="info-message">
              <Trans i18nKey={`rules.flyouts.ruleEditor.actions.setupEmailTimeout`}>
                Polling timed out.
                <Hyperlink href={actionsEmailSetupUrl} onClick={this.clickedSetup} target="_blank">{t('rules.flyouts.ruleEditor.actions.tryAgain')}</Hyperlink>
              </Trans>
            </div>
          </div>
        }
        {
          showSetupComplete &&
          <div className="action-email-setup">
            <ThemedSvgContainer className="icon" paths={themedPaths.checkmarkBubble} />
            <div className="info-message">{t('rules.flyouts.ruleEditor.actions.emailSetupConfirmed')}</div>
          </div>
        }
      </div>
      : null
    );
  }
}
