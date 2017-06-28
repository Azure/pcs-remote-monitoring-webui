// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

class LeftNav extends Component {
  render() {
    return (
    	<Grid>
    		<Row className="show-grid">
    			<Col xs={6} xsOffset={12}>
    				Copyright &copy; Microsoft. All rights reserved.
    			</Col>
    		</Row>
    	</Grid>
    );
  }
}

export default LeftNav;