// Copyright (c) Microsoft. All rights reserved.

import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import { Help } from './help';

export const HelpContainer = withRouter(translate()(Help));
