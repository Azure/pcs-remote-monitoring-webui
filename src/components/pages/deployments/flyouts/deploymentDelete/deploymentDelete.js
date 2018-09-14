// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { LinkedComponent } from 'utilities';
import { Modal } from 'components/shared';

import './deploymentDelete.css';

export class DeploymentDelete extends LinkedComponent {

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
    const { onClose } = this.props;

    return (
      <Modal onClose={onClose} className="delete-package-container">
        TODO
      </Modal>
    );
  }
}
