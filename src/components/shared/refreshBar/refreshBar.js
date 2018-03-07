// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import moment from 'moment';
import { Btn } from 'components/shared';
import { svgs } from 'utilities';

import './refreshBar.css';

export const RefreshBar = (props) => (
  <div className="last-updated-container">
    {
      props.isPending || props.time
        ? <span className="time">
            <span className="refresh-text">Last refreshed | </span>
            { !props.isPending ? moment(props.time).format('MM/DD/YYYY, hh:mm:ss') : '--/--/----, --:--:--' }
          </span>
        : null
    }
    <Btn svg={svgs.refresh} className={`refresh-btn ${props.isPending ? 'refreshing' : ''}`} onClick={!props.isPending && props.refresh} />
  </div>
);
