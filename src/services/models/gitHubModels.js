// Copyright (c) Microsoft. All rights reserved.

import { reshape } from 'utilities';

export const toGitHubModel = (response = []) =>
  response.length > 0
    ? reshape(response[0], {
      'name': 'version',
      'htmlUrl': 'releaseNotesUrl'
    })
    : { 'name': undefined, 'htmlUrl': undefined };
