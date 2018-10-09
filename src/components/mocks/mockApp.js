// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { configureStore } from 'store/configureStore';

// Initialize internationalization for testing
i18n
  .init({
    fallbackLng: 'cimode',
    debug: false,
    saveMissing: false,

    interpolation: {
      escapeValue: false, // not needed for react!!
    },

    react: {
      wait: false,
      nsMode: 'fallback', // Set it to fallback to let passed namespaces to translated hoc act as fallbacks
    },
  });

// Include cross browser polyfills
import 'polyfills';

class MockApp extends Component {
  constructor(props) {
    super(props);
    this.store = configureStore();
  }

  render() {
    return (
      <Provider store={this.store}>
        <Router>
          <I18nextProvider i18n={i18n}>
            {this.props.children}
          </I18nextProvider>
        </Router>
      </Provider>
    );
  }
}

export default MockApp;
