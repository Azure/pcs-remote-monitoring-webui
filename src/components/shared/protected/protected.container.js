// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { getUser } from 'store/reducers/appReducer';
import { ProtectedImpl } from './protected.impl';

const mapStateToProps = state => ({
  userPermissions: getUser(state).permissions
});

export const Protected = connect(mapStateToProps, null)(ProtectedImpl);
