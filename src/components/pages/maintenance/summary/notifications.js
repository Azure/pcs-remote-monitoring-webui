// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { AlertGrid } from 'components/pages/maintenance/grids';
import { AjaxError } from 'components/shared';

export const Notifications = ({ isPending, alerts, history, error, ...props }) => {
  const gridProps = {
    ...props,
    rowData: isPending ? undefined : alerts,
    onRowClicked: ({ data: { ruleId }}) => history.push(`/maintenance/rule/${ruleId}`)
  };
  return (
    !error
      ?
        !isPending && alerts.length === 0
          ? <div className="no-data-msg">{props.t('maintenance.noData')}</div>
          : <AlertGrid {...gridProps} />
      : <AjaxError t={props.t} error={error} className="padded-error" />
  );
};
