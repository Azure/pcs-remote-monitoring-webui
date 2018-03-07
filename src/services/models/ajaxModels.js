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
      return "Oops, there was no response from the server.";
    } else if (this.status === 401) { // User not logged in
      return "You need to login to call the service.";
    } else if (this.status === 403) { // User not authorized
      return "You are not authorized to call the service.";
    } else if (this.status === 404) { // Endpoint not found
      return "Oops, we were not able to find the service.";
    } else if (this.status >= 300 && this.status < 400) { // Redirection
      return "Oops, we got a redirection error.";
    } else if (Config.retryableStatusCodes.has(this.status)) {
      return `Oops, we got a temporary error from the service
              but were unable to recover. Try again later.`;
    } else {
      return this.errorMessage;
    }
  }
}

export class RetryableAjaxError extends AjaxError {
  static from = ajaxError => new RetryableAjaxError(ajaxError);
}
