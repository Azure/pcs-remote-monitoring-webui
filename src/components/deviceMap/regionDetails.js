import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import lang from '../../common/lang';
import './regionDetails.css';

class RegionDetails extends Component {
  render() {
    // TODO: Replace with values from service
    return (
      <Col md={3} className="device-location-conatiner">
        <div className="region-container">
          <h1 className="region">{lang.REGIONDETAILS.REGION}</h1>
          <div>{lang.REGIONDETAILS.DEVICES}</div>
          <Row className="alarm-warning-container">
            <Col md={5} className="total-alarms-container">                        
              <div className="total-alarms">10</div>
              <svg className=" total triangle">
                <polygon points="25,2.5 48.5,49.8 2.5,49.8" fill="#fc540a" />
              </svg>
              <div className="alarms">{lang.REGIONDETAILS.ALARMS}</div>
            </Col>
            <Col md={6} className=" total-alarms-container warnings-container">
              <div className=" total-alarms total-warnings">30</div>
              <svg className="triangle rectangle">
                <rect width="8" height="8" fill="#FDE870" />
              </svg>
              <div className=" total warnings">{lang.REGIONDETAILS.WARNINGS}</div>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="total-container">
              <div className="total">40</div>
              <div className="warnings">{lang.REGIONDETAILS.TOTAL}</div>
            </Col>
            <Col md={4} className="total-container total-online-container">
              <div className="total-online">25</div>
              <div className="online">{lang.REGIONDETAILS.ONLINE}</div>
            </Col>
            <Col md={4} className="total-container total-offline-container">
              <div className="total-offline">15</div>
              <div className="offline">{lang.REGIONDETAILS.OFFLINE}</div>
            </Col>
          </Row>
        </div>
      </Col>
    );
  }
}
export default RegionDetails;
