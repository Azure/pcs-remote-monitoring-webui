// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Header from './header.js';
import LeftNav from './leftNav.js';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './main.css';

export default class Main extends Component {
    render() {
        return (
            <div>
                <Header />
                <div className="body">
                    <LeftNav />
                    <div className="content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}
