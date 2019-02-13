// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

import './modalContent.scss';

/** A presentational component containing the content of the modal */
export const ModalContent = ({ children, className }) => (
  <div className={joinClasses('modal-content', className)}>{children}</div>
);
