// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import Config from 'app.config';
import { configureStore } from 'store/configureStore';
import { AppContainer as App } from 'components/app.container';
import { configureStore as configureWalkthroughStore } from 'walkthrough/store/configureStore';
import { AppContainer as WalkthroughApp } from 'walkthrough/components/app.container';
import registerServiceWorker from 'registerServiceWorker';
import { AuthService } from 'services';
import { epics as appEpics } from 'store/reducers/appReducer';

// Initialize internationalization
import './i18n';

// Include cross browser polyfills
import './polyfills';

// Include base page css
import './index.css';

// Initialize the user authentication
AuthService.onLoad(() => {
  // Create the redux store and redux-observable streams
  const store = Config.showWalkthroughExamples
    ? configureWalkthroughStore()
    : configureStore();

  // Initialize the app redux state
  store.dispatch(appEpics.actions.initializeApp());

  // Create the React app
  ReactDOM.render(
    <Provider store={store}>
      <Router>
        {Config.showWalkthroughExamples
          ? <WalkthroughApp />
          : <App />
        }
      </Router>
    </Provider>,
    document.getElementById('root')
  );

  registerServiceWorker();
});
