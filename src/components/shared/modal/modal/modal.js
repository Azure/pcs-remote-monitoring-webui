// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import {
  ModalContent,
  ModalFadeBox
} from '..';
import { joinClasses } from 'utilities';

import './modal.css';

export class Modal extends Component {

  componentDidMount() {
    if (this.props.onClose) {
      window.addEventListener('keydown', this.listenKeyboard, true);
    }
  }

  componentWillUnmount() {
    if (this.props.onClose) {
      window.removeEventListener('keydown', this.listenKeyboard, true);
    }
  }

  listenKeyboard = (event) => {
    if (event.key === 'Escape' || event.keyCode === 27) {
      this.props.onClose();
    }
  }

  onOverlayClick = () => {
    this.props.onClose();
  }

  render() {
    return (
      <div className={joinClasses('modal-container', this.props.className)}>
        <ModalFadeBox onClick={this.onOverlayClick} />
        <ModalContent>
          {this.props.children}
        </ModalContent>
      </div>
    );
  }
}
