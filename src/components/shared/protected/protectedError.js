// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { ErrorMsg } from '../forms';
import { joinClasses } from 'utilities';

export const ProtectedError = ({ permission, t, className }) => (
  <ErrorMsg className={joinClasses('protected-error', className)}>{t('protected.permissionDenied', { permission })}</ErrorMsg>
);
