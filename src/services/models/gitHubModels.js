// Copyright (c) Microsoft. All rights reserved.

import { reshape } from 'utilities';

const emptyResponse = { name: undefined, htmlUrl: undefined };

export const toGitHubModel =([ response = emptyResponse ] = []) => reshape(response, {
    'name': 'version',
    'htmlUrl': 'releaseNotesUrl'
});
