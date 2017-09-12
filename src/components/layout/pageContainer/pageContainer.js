// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import './pageContainer.css';

/**
 * A presentational component for rendering a page.
 * The children of the component should contain the entire page layout.
 */
export default function PageContainer(props) {
    return (
        <div className="page-container">
            {props.children}
        </div>
    );
}
