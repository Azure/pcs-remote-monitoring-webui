import Config from 'app.config';
import { HttpClient } from 'utilities/httpClient';
import { toDiagnosticsRequestModel } from './models';

const ENDPOINT = Config.serviceUrls.diagnostics;

/** Contains methods for calling the diagnostics service */
export class DiagnosticsService {

  /** Posts an event */
  static logEvent(eventModel) {
    return HttpClient.post(`${ENDPOINT}diagnosticsevents`, toDiagnosticsRequestModel(eventModel));
  }
}
