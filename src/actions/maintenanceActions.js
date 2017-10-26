// Copyright (c) Microsoft. All rights reserved.

import Rx from 'rxjs';
import * as types from './actionTypes';
import { loadFailed } from './ajaxStatusActions';
import ApiService from '../common/apiService';

/**
 * Get occurrences count from alarms
 *
 * @param {array} alarms An array containing alarms triggered by one rule
 */
const getOccurences = (alarms = [], ruleId) => {
  if(!ruleId) return;
  let occrrences = {
    last_occrrences: (alarms[0] || {}).DateCreated || ''
  };
  alarms.forEach(({ Status }) => occrrences[Status] = (occrrences[Status] || 0) + 1);
  return {...occrrences, [ruleId]: alarms};
}

export const loadMaintenanceDataSuccess = data => {
  return {
    type: types.LOAD_MAINTENANCE_DATA_SUCCESS,
    data
  };
};

export const loadMaintenanceData = (params) => {
  return dispatch => {
      dispatch({ type: types.LOAD_MAINTENANCE_DATA_IN_PROGRESS });
      return Rx.Observable.fromPromise(
          ApiService.getAlarmsByRule(params)
        )
        .flatMap(({ Items }) => Items)
        .flatMap(ruleSummary => Rx.Observable
          .fromPromise(ApiService.getAlarmListByRule(ruleSummary.Rule.Id, {
            ...params,
            order: 'desc'
          }))
          .map(alarms => getOccurences(alarms.Items, ruleSummary.Rule.Id))
          .map(occurences => {
            return {...ruleSummary, ...occurences};
          })
        )
      .flatMap(ruleSummary => Rx.Observable
        .fromPromise(ApiService.getRuleList(ruleSummary.Rule.Id))
        .map(rule => {
          const open = ruleSummary.open || 0;
          const closed  = ruleSummary.closed || 0;
          const acknowledged = ruleSummary.acknowledged || 0;
          const total = open + closed + acknowledged;
          return {
            ...ruleSummary,
            rule,
            name: rule.Name,
            description: rule.Description,
            severity: rule.Severity,
            open_occrrences: open,
            close_occrrences: closed,
            ack_occrrences: acknowledged,
            total_occrrences: total,
            last_occrrences: ruleSummary.last_occrrences,
            id: rule.Id
          };
        })
      )
      .reduce((acc, cur) => acc.concat([cur]), [])
      .subscribe(
        data => dispatch(loadMaintenanceDataSuccess(data)),
        error => dispatch(loadFailed(error))
      );
    }
};

export const updateAlarmsStatus = data => {
  return {
    type: types.UPDATE_ALARMS_STATUS,
    data
  };
};
