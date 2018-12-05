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
import { toSinglePropertyDiagnosticsModel } from 'services/models';

import './deleteModal.scss';

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
    const { deleteItem, itemId, logEvent } = this.props;
    logEvent(
      toSinglePropertyDiagnosticsModel(
        'DeleteModal_DeleteClick',
        'ItemId',
        itemId));
    deleteItem(itemId);
    this.setState({ changesApplied: true });
  }

  genericCloseClick = (eventName) => {
    const { onClose, itemId, logEvent } = this.props;
    logEvent(
      toSinglePropertyDiagnosticsModel(
        eventName,
        'DeleteModal_CloseClick',
        'ItemId',
        itemId));
    onClose();
  }

  render() {
    const { t, isPending, error, title, deleteInfo } = this.props;
    const { changesApplied } = this.state;

    return (
      <Modal onClose={() => this.genericCloseClick('DeleteModal_ModalClose')} className="delete-modal-container">
        <div className="delete-header-container">
          <div className="delete-title">{title}</div>
          <Btn className="delete-close-btn" onClick={() => this.genericCloseClick('DeleteModal_CloseClick')} svg={svgs.x} />
        </div>
        <div className="delete-info">
          {deleteInfo}
        </div>
        <div className="delete-summary">
          {
            !changesApplied && <BtnToolbar>
              <Btn svg={svgs.trash} primary={true} onClick={this.apply}>{t('modal.delete')}</Btn>
              <Btn svg={svgs.cancelX} onClick={() => this.genericCloseClick('DeleteModal_CancelClick')}>{t('modal.cancel')}</Btn>
            </BtnToolbar>
          }
          {isPending && <Indicator />}
          {changesApplied && error && <AjaxError className="delete-error" t={t} error={error} />}
        </div>
      </Modal>
    );
  }
}
