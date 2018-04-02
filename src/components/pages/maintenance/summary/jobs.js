// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { JobGrid } from 'components/pages/maintenance/grids';

export const Jobs = ({ isPending, jobs, history, ...props }) => {
  const gridProps = {
    ...props,
    rowData: isPending ? undefined : jobs,
    onRowClicked: ({ data: { jobId }}) => history.push(`/maintenance/job/${jobId}`)
  };
  return (
    !isPending && jobs.length === 0 ? <div className="no-data-msg">No data</div> : <JobGrid {...gridProps} />
  )
};
