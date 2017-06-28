// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import Main from './layouts/main/main.js';
import Dashboard from './layouts/dashboard/dashboard.js';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

const app = document.getElementById('root');

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={Main}>
			<IndexRoute component={Dashboard}></IndexRoute>
			<Route path="/dashboard" component={Dashboard}></Route>
		</Route>
	</Router>,
app);

registerServiceWorker();
