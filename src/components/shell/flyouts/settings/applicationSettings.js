// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { Btn, FormGroup, FormLabel, FormControl, Indicator, Svg, FileInput } from 'components/shared';
import { svgs, isValidExtension } from 'utilities';
import Flyout from 'components/shared/flyout';
import Config from 'app.config';

import './applicationSettings.scss';

const Section = Flyout.Section;

class ApplicationSettings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentLogo: this.props.logo,
      currentApplicationName: this.props.name,
      edit: false,
      previewLogo: this.props.logo,
      newLogoName: undefined,
      isDefaultLogo: this.props.isDefaultLogo,
      validating: false,
      isValidFile: false
    }
  }

  renderSvgLogo = (logo) => <Svg path={logo} className="logo-svg" />;

  renderUploadContainer = () => {
    const { t, applicationNameLink } = this.props;
    const { isDefaultLogo, isValidFile, currentLogo, previewLogo, newLogoName, currentApplicationName } = this.state;
    const fileNameClass = isValidFile ? 'file-name-valid' : 'file-name-invalid';
    return (
      <div className="upload-logo-name-container">
        <div className="upload-logo-container">
          <div className="image-preview">
            {
              isDefaultLogo
                ? this.renderSvgLogo(currentLogo)
                : <img className="logo-img" src={previewLogo} alt={t('applicationSettings.previewLogo')} />
            }
          </div>
          <div className="replace-logo">{t('applicationSettings.replaceLogo')}</div>
          <div className="upload-btn-container">
            <FileInput className="upload-button" onChange={this.onUpload}
              accept={Config.validExtensions} label={t('applicationSettings.upload')} t={t} />
            <div className="file-upload-feedback">
              {
                isValidFile
                  ? <Svg className="checkmark" path={svgs.checkmark} alt={t('applicationSettings.checkmark')} />
                  : newLogoName && <Svg className="invalid-file-x" path={svgs.x} alt={t('applicationSettings.error')} />
              }
            </div>
            <div className={fileNameClass}>{newLogoName}</div>
          </div>
          {
            !isValidFile && newLogoName &&
            <div className="upload-error-message">
              <Svg className="upload-error-asterisk" path={svgs.error} alt={t('applicationSettings.error')} />
              {t('applicationSettings.uploadError')}
            </div>
          }
          <Section.Content className="platform-section-description show-line-breaks">{t('applicationSettings.logoDescription')}</Section.Content>
        </div>
        <FormGroup className="name-input-container">
          <FormLabel className="section-subtitle">{t('applicationSettings.applicationName')}</FormLabel>
          <FormControl type="text" className="name-input long"
            placeholder={t(currentApplicationName)} link={applicationNameLink} />
        </FormGroup>
      </div>
    );
  }

  render() {
    const { t } = this.props;
    const { isDefaultLogo, validating, currentLogo, currentApplicationName, edit } = this.state;
    return (
      <Section.Container className="setting-section">
        <Section.Header>{t('applicationSettings.nameAndLogo')}</Section.Header>
        <Section.Content>{t('applicationSettings.nameLogoDescription')}</Section.Content>
          <Section.Content>
            {
              edit
                ? validating
                  ? <div className="upload-logo-name-container">
                      <Indicator size='small' />
                    </div>
                  : this.renderUploadContainer()
                : <div>
                  <div className="current-logo-container">
                    <div className="current-logo-name">
                      <div className="current-logo">
                        {
                          isDefaultLogo
                            ? this.renderSvgLogo(currentLogo)
                            : <img className="current-logo" src={currentLogo} alt={t('applicationSettings.currentLogo')} />
                        }
                      </div>
                      <div className="name-container">{t(currentApplicationName)}</div>
                    </div>
                    <div className="edit-button-div">
                      <Btn svg={svgs.edit} onClick={this.enableEdit} className="edit-button">{t('applicationSettings.edit')}</Btn>
                    </div>
                  </div>
                </div>
            }
          </Section.Content>
      </Section.Container>
    );
  }

  enableEdit = () =>  this.setState({ edit: true });

  onUpload = (e) => {
    let file = e.target.files[0];
    this.setState({
      validating: true,
      validFile: false
    });
    if (file.size <= Config.maxLogoFileSizeInBytes && isValidExtension(file)) {
      this.setState({
        newLogoName: file.name,
        previewLogo: URL.createObjectURL(file),
        isDefaultLogo: false,
        validating: false,
        isValidFile: true
      });
    } else {
      this.setState({
        previewLogo: this.state.currentLogo,
        newLogoName: file !== undefined ? file.name : undefined,
        isDefaultLogo: this.props.isDefaultLogo,
        validating: false,
        isValidFile: false
      });
      file = undefined;
    }
    this.props.onUpload(file);
  };
}

export default (ApplicationSettings);
