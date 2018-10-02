// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import {
  AjaxError,
  Btn,
  BtnToolbar,
  Indicator,
  Modal
} from 'components/shared';
import { svgs } from 'utilities';

import './deleteModal.css';

export class DeleteModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      changesApplied: false
    };
  }

  componentWillReceiveProps({ error, isPending, onDelete }) {
    if (this.state.changesApplied && !error && !isPending) {
      onDelete();
    }
  }

  apply = () => {
    const { deleteItem, itemId } = this.props;
    deleteItem(itemId);
    this.setState({ changesApplied: true });
  }

  render() {
    const { t, onClose, isPending, error, title, deleteInfo } = this.props;
    const { changesApplied } = this.state;

    return (
      <Modal onClose={onClose} className="delete-modal-container">
        <div className="delete-header-container">
          <div className="delete-title">{title}</div>
          <Btn className="delete-close-btn" onClick={onClose} svg={svgs.x} />
        </div>
        <div className="delete-info">
          {deleteInfo}
        </div>
        <div className="delete-summary">
          {
            !changesApplied && <BtnToolbar>
              <Btn svg={svgs.trash} primary={true} onClick={this.apply}>{t('modal.delete')}</Btn>
              <Btn svg={svgs.cancelX} onClick={onClose}>{t('modal.cancel')}</Btn>
            </BtnToolbar>
          }
          {isPending && <Indicator />}
          {changesApplied && error && <AjaxError className="delete-error" t={t} error={error} />}
        </div>
      </Modal>
    );
  }
}
