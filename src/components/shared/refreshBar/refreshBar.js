// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import moment from 'moment';
import { Btn } from 'components/shared';
import { toDiagnosticsModel } from 'services/models';
import { svgs } from 'utilities';
import { DEFAULT_TIME_FORMAT } from 'components/shared/pcsGrid/pcsGridConfig';

import './refreshBar.scss';

export class RefreshBar extends Component {

  refresh = () => {
    this.props.logEvent(toDiagnosticsModel('Refresh_Click', {}));
    return !this.props.isPending && this.props.refresh();
  }

  render () {
    const { t, isPending, time} = this.props;
    return (
      <div className="last-updated-container">
        {isPending || time
            ? <span className="time">
                <span className="refresh-text">{t('refreshBar.lastRefreshed')} | </span>
                { !isPending ? moment(time).format(DEFAULT_TIME_FORMAT) : <span className="empty-text"></span> }
              </span>
            : null
        }
        <Btn svg={svgs.refresh} className={`refresh-btn ${isPending ? 'refreshing' : ''}`} onClick={this.refresh} />
      </div>
    );
  }
}
