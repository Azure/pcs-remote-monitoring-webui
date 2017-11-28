// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import Critical from '../../assets/icons/Critical.svg';
import Warning from '../../assets/icons/Warning.svg';
import InfoFailed from '../../assets/icons/InfoFailed.svg';
import lang from '../../common/lang';

import './maintenanceSummary.css';

/**
 * Maintenance Summary Component.
 * @param {Object} alarms - The alarms summary.
 * @param {string} alarms.total - The total number of alarms.
 * @param {string} alarms.critical - The number of critical alarms.
 * @param {string} alarms.warning - The number of warning alarms.
 * @param {Object} jobs - The system status summary.
 * @param {string} jobs.total - The total number of jobs.
 * @param {string} jobs.failed - The number of failed jobs.
 * @param {string} jobs.succeeded - The total number of succeeded jobs.
 * @param {string} selectedGrid - The current selected grid.
 */
const MaintenanceSummary = ({ alarms, jobs, selectedGrid = 'alarms' }) => {
  const iconStyle = {
    height: 16,
    width: 16
  };
  const alarmSelected = selectedGrid === 'alarms' ? 'alarm-' : '';
  const systemSelected = selectedGrid === 'alarms' ? '' : 'system-';
  return (<div className="summary-container">
          <div className="summary-header">
            {lang.MAINTENANCE}
          </div>
          <div className="summary-body">
            <div className={`${alarmSelected}score-board`}>
              <div className="score">{alarms.total}</div>
              <div className="score-label">{lang.OPEN_ALARMS}</div>
              <div className="score-board-details">
                <div className="details-content">
                  <img src={Critical} {...iconStyle} alt={Critical} />
                  <span className="alarm-count">{alarms.critical}</span>
                  <span className="alarm-text">{lang.CRITICAL}</span>
                </div>
                <div className="details-content">
                  <img src={Warning} {...iconStyle} alt={Warning} />
                  <span className="alarm-count">{alarms.warning}</span>
                  <span className="alarm-text">{lang.WARNING}</span>
                </div>
              </div>
            </div>
            <div className={`${systemSelected}score-board`}>
              <img src={InfoFailed} className="info-failed" alt={InfoFailed} />
              <div className="score">{jobs.failed}</div>
              <div className="score-label">{lang.FAILED_JOBS}</div>
              <div className="score-board-details">
                <div className="details-content">
                  <span className="job-count">{jobs.total}</span>
                  <span className="job-text">{lang.TOTAL}</span>
                </div>
                <div className="details-content">
                  <span className="job-count">{jobs.succeeded}</span>
                  <span className="job-text">{lang.SUCCEEDED}</span>
                </div>
              </div>
            </div>
          </div>
      </div>);
};

export default MaintenanceSummary;
