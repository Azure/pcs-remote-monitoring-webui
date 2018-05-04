// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import Flyout from 'components/shared/flyout';
import { Btn, Indicator, ToggleBtn } from 'components/shared';
import { svgs, LinkedComponent } from 'utilities';
import ApplicationSettings from 'components/app/flyouts/settings/applicationSettings';

import './settings.css';

const Section = Flyout.Section;

export class Settings extends LinkedComponent {

  constructor(props) {
    super(props);

    this.state = {
      desiredSimulationState: this.props.isSimulationEnabled,
      logoFile: undefined,
      applicationName: '',
      loading: false,
      toggledSimulation: false,
      madeLogoUpdate: false
    };

    const { t } = this.props;

    // Helper objects for choosing the correct label for the simulation service toggle input
    this.desiredSimulationLabel = {
      true: t('settingsFlyout.start'),
      false: t('settingsFlyout.stop')
    };
    this.currSimulationLabel = {
      true: t('settingsFlyout.flowing'),
      false: t('settingsFlyout.stopped')
    };

    this.applicationName = this.linkTo('applicationName')
      .map(value => value.length === 0 ? undefined : value);

    this.props.getSimulationStatus();
  }

  componentWillReceiveProps({ isSimulationEnabled, simulationTogglePending,
    simulationToggleError, setLogoPending, setLogoError, getSimulationPending, getSimulationError }) {
    const { madeLogoUpdate, desiredSimulationState } = this.state;
    if (desiredSimulationState === undefined && isSimulationEnabled !== undefined && !getSimulationPending && !getSimulationError) {
      this.setState({
        desiredSimulationState: isSimulationEnabled
      });
    }

    if (madeLogoUpdate && !setLogoPending && !setLogoError) {
      this.props.onClose();
    }
  }

  onChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  onSimulationChange = ({ target }) => {
    const { name, value } = target;
    const etag = this.props.simulationEtag;
    this.setState({
      toggledSimulation: true,
      [name]: value
    });
    this.props.toggleSimulationStatus(etag, value);
  }

  apply = (event) => {
    const { logoFile, applicationName } = this.state;
    if (logoFile || applicationName) {
      var headers = {};
      if (applicationName) {
        headers.name = applicationName
      }
      if (logoFile) {
        headers['Content-Type'] = logoFile.type;
      } else {
        headers['Content-Type'] = "text/plain";
      }
      this.props.updateLogo(logoFile, headers);
      this.setState({
        madeLogoUpdate: true
      });
    }
    event.preventDefault();
  };

  onUpload = (file) => {
    this.setState({
      logoFile: file
    });
  };

  render() {
    const { t, onClose, theme, changeTheme, version, releaseNotesUrl, isSimulationEnabled,
      simulationToggleError, setLogoError, getSimulationPending, getSimulationError } = this.props;
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const { desiredSimulationState, loading, logoFile, applicationName, toggledSimulation, madeLogoUpdate } = this.state;
    const hasChanged = logoFile !== undefined || applicationName !== '';
    const hasSimulationChanged = !getSimulationPending && !getSimulationError && (isSimulationEnabled !== desiredSimulationState)
    const simulationLabel = hasSimulationChanged ? this.desiredSimulationLabel[desiredSimulationState] : this.currSimulationLabel[isSimulationEnabled];

    return (

      <form onSubmit={this.apply}>
        <Flyout.Container>
          <Flyout.Header>
            <Flyout.Title>{t('settingsFlyout.title')}</Flyout.Title>
            <Flyout.CloseBtn onClick={onClose} />
          </Flyout.Header>
          <Flyout.Content className="settings-workflow-container">
            <Section.Container collapsable={false} className="app-version">
              <Section.Header>{t('settingsFlyout.version', { version })}</Section.Header>
              <Section.Content className="release-notes">
                <a href={releaseNotesUrl} target="_blank">{t('settingsFlyout.viewRelNotes')}</a>
              </Section.Content>
            </Section.Container>
            <Section.Container className="simulation-toggle-container">
              <Section.Header>{t('settingsFlyout.simulationData')} </Section.Header>
              <Section.Content className="simulation-description">
                {t('settingsFlyout.simulationDescription')}
                {
                  getSimulationError
                    ? <div className="simulation-toggle"> {t('settingsFlyout.simulationLoadError')} </div>
                    : <div className="simulation-toggle">
                      <ToggleBtn
                        className="simulation-toggle-button"
                        name="desiredSimulationState"
                        value={desiredSimulationState}
                        disabled={getSimulationPending}
                        onChange={this.onSimulationChange} />
                      <div className="simulation-toggle-label">
                        {getSimulationPending ? t('settingsFlyout.loading') : simulationLabel}
                      </div>
                    </div>
                }
              </Section.Content>
            </Section.Container>
            <Section.Container>
              <Section.Header>{t('settingsFlyout.theme')}</Section.Header>
              <Section.Content>
                {t('settingsFlyout.changeTheme')}
                <button onClick={() => changeTheme(nextTheme)} className="toggle-theme-btn">
                  {t('settingsFlyout.switchTheme', { nextTheme })}
                </button>
              </Section.Content>
            </Section.Container>
            <ApplicationSettings onUpload={this.onUpload} applicationNameLink={this.applicationName} {...this.props} />
            {
              (toggledSimulation && simulationToggleError) &&
              <div className="toggle-error">
                {t('settingsFlyout.toggleError')}
              </div>
            }
            {
              (madeLogoUpdate && setLogoError) &&
              <div className="set-logo-error">
                {t('settingsFlyout.setLogoError')}
              </div>
            }
            <div className="btn-container">
              {
                !loading && hasChanged &&
                <Btn type="submit" className="apply-button">{t('settingsFlyout.apply')}</Btn>
              }
              <Btn svg={svgs.x} onClick={onClose} className="close-button">{hasChanged ? t('settingsFlyout.cancel') : t('settingsFlyout.close')}</Btn>
              {loading && <Indicator size='small' />}
            </div>
          </Flyout.Content>
        </Flyout.Container>
      </form>
    );
  }
}
