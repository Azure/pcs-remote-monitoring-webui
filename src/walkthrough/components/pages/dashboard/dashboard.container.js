// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Dashboard } from './dashboard';

export const DashboardContainer = translate()(connect(null, null)(Dashboard));
