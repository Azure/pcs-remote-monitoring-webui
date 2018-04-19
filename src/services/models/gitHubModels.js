// Copyright (c) Microsoft. All rights reserved.

import { camelCaseReshape } from 'utilities';

const emptyResponse = { name: undefined, htmlUrl: undefined };

export const toGitHubModel = ([response = emptyResponse] = []) => camelCaseReshape(response, {
  'name': 'version',
  'htmlUrl': 'releaseNotesUrl'
});
