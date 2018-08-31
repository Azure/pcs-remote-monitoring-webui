// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { joinClasses } from 'utilities';

import './modalFadeBox.css';

/** A presentational component containing the content of the modal */
export const ModalFadeBox = ({ children, className, onClick }) => (
  <div onClick={onClick} className={joinClasses('modal-fade-box', className)}>{children}</div>
);
