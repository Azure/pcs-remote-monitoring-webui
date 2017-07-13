// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Button } from 'react-bootstrap';
import { Header, Body, Footer } from '../../framework/flyout/flyout';

import './flyout.css';

/*
*  Functional components focus on how things look.
*  In most cases, it won't worry about state.
*  Its receive data and actions from container/parent component.
*/

const Flyout = ({show, content, onClose}) => {
  return show ? (
      <div className="flyoutWrapper">
        <Header>
            <h1>DeviceId: {content.DeviceId}</h1>
        </Header>
        <Body>
            <p>Time: {content.Time}</p>
            <p>Body: {content.Body}</p>
        </Body>
        <Footer>
            <Button
              bsStyle="primary"
              onClick={onClose}>Close</Button>
        </Footer>
      </div>
  ) : null;
}

export default Flyout;
