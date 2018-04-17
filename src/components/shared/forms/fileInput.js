// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Btn } from 'components/shared';
import { joinClasses, svgs } from 'utilities';

import './styles/fileInput.css';

export class FileInput extends Component {
  constructor(props) {
    super(props);

    this.fileInput = undefined;
  }

  setFileInputRef = element => this.fileInput = element;

  clickFileInput = () => {
    if (this.fileInput) this.fileInput.click();
  };

  render() {
    const { t, className, accept, onChange } = this.props;
    return (
      <div className={joinClasses(className, "file-upload")}>
        <Btn className="upload-btn" svg={svgs.upload} onClick={this.clickFileInput}>
          {t('fileInput.upload')}
        </Btn>
        <input className="input-file" ref={this.setFileInputRef} type="file" accept={accept} onChange={onChange} />
      </div>
    );
  }
}

FileInput.propTypes = {
  className: PropTypes.string,
  t: PropTypes.func,
  accept: PropTypes.string,
  onChange: PropTypes.func
};
