// Copyright (c) Microsoft. All rights reserved.

const Config = {
  // Constants
  defaultAjaxTimeout: 10000, // 10s
  maxRetryAttempts: 2,
  retryWaitTime: 2000, // On retryable error, retry after 2s
  retryableStatusCodes: new Set([ 0, 502, 503 ])
};

export default Config;
