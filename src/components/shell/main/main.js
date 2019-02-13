// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import './main.scss';

/**
 * A presentational component for rendering a page.
 * The children of the component should contain the entire page layout.
 */
const Main = (props) => (
  <main className="app-main">
    <div className="main-container">
      { props.children }
    </div>
  </main>
);

export default Main;
