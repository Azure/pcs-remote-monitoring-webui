// Copyright (c) Microsoft. All rights reserved.

import Config from 'app.config';
import { HttpClient } from 'utilities/httpClient';

import { toGitHubModel } from './models';

const ENDPOINT = Config.serviceUrls.gitHubReleases;

export class GitHubService {

  /** Get the current release version and release notes link. */
  static getReleaseInfo() {
    return HttpClient.get(ENDPOINT, {}, false)
      .map(toGitHubModel);
  }
}
