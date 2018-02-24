// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import './pageContent.css';

/** A presentational component containing the content for a page */
const PageContent = (props) => (
  <div className={`page-content-container ${props.className || ''}`}>
    {props.children}
  </div>
);

export default PageContent;
