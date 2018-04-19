// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { ErrorMsg } from '../forms';
import { joinClasses } from 'utilities';

import './ajaxError.css';

export const AjaxError = ({ error, t, className }) => (
  <div className={joinClasses('ajax-error-container', className)}>
    <ErrorMsg>{ t('errorFormat', { message: t(error.message, { message: error.errorMessage }) }) }</ErrorMsg>
  </div>
);
