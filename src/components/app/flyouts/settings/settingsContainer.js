// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import {
  redux as appRedux,
  getTheme,
  getVersion,
  getLogo,
  isDefaultLogo,
  getName,
  getReleaseNotes
} from 'store/reducers/appReducer';
import {
  isSimulationEnabled,
  getSimulationEtag
} from 'store/reducers/deviceSimulationReducer';
import { Settings } from './settings';
import { epics as appEpics } from 'store/reducers/appReducer';
import { epics as simulationEpics } from 'store/reducers/deviceSimulationReducer';

const mapStateToProps = state => ({
  theme: getTheme(state),
  version: getVersion(state),
  logo: getLogo(state),
  name: getName(state),
  isDefaultLogo: isDefaultLogo(state),
  releaseNotesUrl: getReleaseNotes(state),
  isSimulationEnabled: isSimulationEnabled(state),
  simulationEtag: getSimulationEtag(state)
});

const mapDispatchToProps = dispatch => ({
  changeTheme: theme => dispatch(appRedux.actions.changeTheme(theme)),
  updateLogo: (logo, headers) => dispatch(appEpics.actions.updateLogo({logo, headers})),
  getSimulationStatus: () => dispatch(simulationEpics.actions.fetchSimulationStatus()),
  toggleSimulationStatus: (etag, enabled) => dispatch(simulationEpics.actions.toggleSimulationStatus({etag, enabled}))
});

export const SettingsContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(Settings));
