// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { AlertGrid } from 'components/pages/maintenance/grids';

export const Notifications = ({ isPending, alerts, history, ...props }) => {
  const gridProps = {
    ...props,
    rowData: isPending ? undefined : alerts,
    onRowClicked: ({ data: { ruleId }}) => history.push(`/maintenance/rule/${ruleId}`)
  };
  return (
    !isPending && alerts.length === 0 ? <div className="no-data-msg">No data</div> : <AlertGrid {...gridProps} />
  );
};
