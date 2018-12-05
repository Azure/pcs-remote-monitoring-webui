// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { Dashboard } from './dashboard';

export const DashboardContainer = withNamespaces()(connect(null, null)(Dashboard));
