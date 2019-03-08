// Copyright (c) Microsoft. All rights reserved.

import React from "react";

import { formatTime } from 'utilities';
import { EMPTY_FIELD_VAL } from 'components/shared/pcsGrid/pcsGridConfig';

export const TimeRenderer = ({ value }) => {
  const formattedTime = formatTime(value);
  return (
    <div className="pcs-renderer-cell">
      <div className="pcs-renderer-time-text">
        {
          formattedTime ? formattedTime : EMPTY_FIELD_VAL
        }
      </div>
    </div>
  );
}
