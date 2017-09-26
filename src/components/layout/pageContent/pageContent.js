// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import './pageContent.css';

/**
 * A presentational component for rendering page content 
 * (e.g. dynamic content other than persistent navigation etc.) 
 */
export default function PageContent(props) {
    return (
        <div className={`page-content ${props.className || ''}`}>
            {props.children}
        </div>
    );
}
