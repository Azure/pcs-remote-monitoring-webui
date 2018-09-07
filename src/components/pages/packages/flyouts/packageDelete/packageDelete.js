// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { LinkedComponent } from 'utilities';
import {
  AjaxError,
  Btn,
  BtnToolbar,
  Indicator,
  Modal
} from 'components/shared';
import { svgs } from 'utilities';

import './packageDelete.css';

export class PackageDelete extends LinkedComponent {

  constructor(props) {
    super(props);

    this.state = {
      changesApplied: false
    };
  }

  componentWillReceiveProps({ error, isPending, onClose }) {
    if (this.state.changesApplied && !error && !isPending) {
      onClose();
    }
  }

  apply = () => {
    const { deletePackage, package: { id } } = this.props;
    deletePackage(id);
    this.setState({ changesApplied: true });
  }

  render() {
    const { t, onClose, isPending, error } = this.props;
    const { changesApplied } = this.state;

    return (
      <Modal onClose={onClose} className="delete-package-container">
        <div className="delete-header-container">
          <div className="delete-title">{t('packages.flyouts.delete.title')}</div>
          <Btn className="delete-close-btn" onClick={onClose} svg={svgs.x} />
        </div>
        <div className="delete-info">
          {t('packages.flyouts.delete.info')}
        </div>
        <div className="delete-summary">
          {
            !changesApplied && <BtnToolbar>
              <Btn svg={svgs.trash} primary={true} onClick={this.apply}>{t('packages.flyouts.delete.delete')}</Btn>
              <Btn svg={svgs.cancelX} onClick={onClose}>{t('packages.flyouts.delete.cancel')}</Btn>
            </BtnToolbar>
          }
          {isPending && <Indicator />}
          {changesApplied && error && <AjaxError className="delete-error" t={t} error={error} />}
        </div>
      </Modal>
    );
  }
}
