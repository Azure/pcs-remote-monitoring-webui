// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { mount } from 'enzyme';
import configureStore from 'store/configureStore';
import AppContainer from 'components/app/app.container';

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

describe('App integration test', () => {
  let store, wrapper;

  it('Create redux store', () => {
    store = configureStore();
  });

  it('Render App component', () => {
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <I18nextProvider i18n={i18n}>
            <AppContainer />
          </I18nextProvider>
        </Router>
      </Provider>
    );
  });

});
