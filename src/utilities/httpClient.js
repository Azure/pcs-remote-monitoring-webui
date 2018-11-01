// Copyright (c) Microsoft. All rights reserved.

import { Observable } from 'rxjs';
import { AuthService } from 'services/authService';
import Config from 'app.config';
import { AjaxError, RetryableAjaxError } from './ajaxModels';

/**
 * A class of static methods for creating ajax requests
 */
export class HttpClient {

  /**
   * Constructs a GET ajax request
   *
   * @param {string} url The url path to the make the request to
   */
  static get(url, options = {}, withAuth = true) {
    return HttpClient.ajax(url, { ...options, method: 'GET' }, withAuth);
  }

  /**
   * Constructs a POST ajax request
   *
   * @param {string} url The url path to the make the request to
   */
  static post(url, body = {}, options = {}, withAuth = true) {
    return HttpClient.ajax(url, { ...options, body, method: 'POST' }, withAuth);
  }

  /**
   * Constructs a PUT ajax request
   *
   * @param {string} url The url path to the make the request to
   */
  static put(url, body = {}, options = {}, withAuth = true) {
    return HttpClient.ajax(url, { ...options, body, method: 'PUT' }, withAuth);
  }

  /**
   * Constructs a PATCH ajax request
   *
   * @param {string} url The url path to the make the request to
   */
  static patch(url, body = {}, options = {}, withAuth = true) {
    return HttpClient.ajax(url, { ...options, body, method: 'PATCH' }, withAuth);
  }

  /**
   * Constructs a DELETE ajax request
   *
   * @param {string} url The url path to the make the request to
   */
  static delete(url, body = {}, options = {}, withAuth = true) {
    return HttpClient.ajax(url, { ...options, body, method: 'DELETE' }, withAuth);
  }

  /**
   * Constructs an Ajax request
   *
   * @param {string} url The url path to the make the request to
   * @param {AjaxRequest} [options={}] See https://github.com/ReactiveX/rxjs/blob/master/src/observable/dom/AjaxObservable.ts
   * @param {boolean} withAuth Allows a backdoor to not avoid wrapping auth headers
   * @return an Observable of the AjaxReponse
   */
  static ajax(url, options = {}, withAuth = true) {
    const { retryWaitTime, maxRetryAttempts } = Config;
    return HttpClient.createAjaxRequest({ ...options, url }, withAuth)
      .flatMap(Observable.ajax)
      // If success, extract the response object and enforce camelCase keys if json response
      .map(ajaxResponse =>
        ajaxResponse.responseType === 'json'
          ? ajaxResponse.response
          : ajaxResponse
      )
      // Classify errors as retryable or not
      .catch(ajaxError => Observable.throw(classifyError(ajaxError)))
      // Retry any retryable errors
      .retryWhen(retryHandler(maxRetryAttempts, retryWaitTime));
  }

  /**
   * A helper method for constructing ajax request objects
   */
  static createAjaxRequest(options, withAuth) {
    return (withAuth ? AuthService.getAccessToken() : Observable.of(null))
      .map(token => ({ // Create the final headers options
        ...jsonHeaders,
        ...(options.headers || {}),
        ...(token ? authenticationHeaders(token) : {})
      }))
      .map(({ 'Content-Type': contentType, ...headers }) => {
        if (contentType) return { ...headers, 'Content-Type': contentType };
        return headers;
      })
      .map(headers => ({
        ...options,
        headers,
        timeout: options.timeout || Config.defaultAjaxTimeout
      }));
  }
}

// HttpClient helper methods

/** A helper function containing the logic for retrying ajax requests */
export const retryHandler = (retryAttempts, retryDelay) =>
  error$ =>
    error$.zip(Observable.range(0, retryAttempts + 1)) // Plus 1 to not count initial call
      .flatMap(([error, attempt]) =>
        (!isRetryable(error) || attempt === retryAttempts)
          ? Observable.throw(error)
          : Observable.of(error)
      )
      .delay(retryDelay);

/** A helper function for checking if a value is a retryable error */
const isRetryable = error => error instanceof RetryableAjaxError;

/** A helper function for classifying errors as retryable or not */
export function classifyError(error) {
  if (Config.retryableStatusCodes.has(error.status)) {
    return RetryableAjaxError.from(error);
  }
  return AjaxError.from(error);
}

/** Headers for a json request */
const jsonHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

/** Headers for an authenticated request */
const authenticationHeaders = (token) => ({
  'Csrf-Token': 'nocheck',
  'Authorization': `Bearer ${token}`
});
