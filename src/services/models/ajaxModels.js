// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';

// Error response abstractions

export class AjaxError {

  static from = ajaxError => new AjaxError(ajaxError);

  constructor(ajaxError) {
    this.ajaxError = ajaxError;
    const resp = ajaxError.response || {};
    this.errorMessage = resp.ExceptionMessage || resp.Message || resp.Error || ajaxError.message || `An unknown error occurred`;
    this.status = ajaxError.status;
    // Log all errors in the console
    console.error(ajaxError);
  }

  /**
   * Wrap the message in a getter method to allow customizing for certain status codes
   */
  get message() {
    if (this.status === 0) { // No response from the service (e.g. timeout, network disconnect, CORS, etc.)
      return 'errorCode.noResponse';
    } else if (this.status === 401) { // User not logged in
      return 'errorCode.notLoggedIn';
    } else if (this.status === 403) { // User not authorized
      return 'errorCode.notAuthorized';
    } else if (this.status === 404) { // Endpoint not found
      return 'errorCode.notFound';
    } else if (this.status >= 300 && this.status < 400) { // Redirection
      return 'errorCode.redirection';
    } else if (Config.retryableStatusCodes.has(this.status)) {
      return 'errorCode.retryFailure';
    }
    return 'errorCode.unknown';
  }
}

export class RetryableAjaxError extends AjaxError {
  static from = ajaxError => new RetryableAjaxError(ajaxError);
}
