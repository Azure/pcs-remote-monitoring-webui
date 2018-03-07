// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import moment from 'moment';
import { DEFAULT_TIME_FORMAT, gridValueFormatters } from 'components/shared/pcsGrid/pcsGridConfig';
import { Indicator } from 'components/shared';

const { checkForEmpty } = gridValueFormatters;

const formatTime = (value) => {
  if (value) {
    const time = moment(value);
    return checkForEmpty((time.unix() > 0) ? time.format(DEFAULT_TIME_FORMAT) : '');
  }
  return value;
}

export const LastTriggerRenderer = ({ value }) => {
  const formattedTime = formatTime(value);
  return (
    formattedTime ? formattedTime : <Indicator pattern="bar" />
  );
}
