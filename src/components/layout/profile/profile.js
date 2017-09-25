// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import ProfileImageNew from '../../../assets/icons/ProfileImageNew.png';
import auth from "../../../common/auth";
import ApiService from '../../../common/apiService';
import lang from "../../../common/lang";

import './profile.css';

class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = { show: false };

    this.userName = '';

    ApiService.getCurrentUser().then(user => {
      if (user) this.userName = user.Name;
    });
  }

  show = () => this.setState({ show: !this.state.show });

  switchUser = () => auth.logout();

  render() {
    return (
      <span className="profile">
        <img
          className="top-nav-icon"
          src={ProfileImageNew}
          alt="ProfileImage"
          onClick={this.show}
          title={this.userName}
        />
        {this.state.show &&
          <ul className="profile-dropdown">
            <li>
              <span onClick={this.switchUser}>{lang.SWITCHUSER}</span>
            </li>
          </ul>
        }
      </span>
    );
  }
}

export default Profile;
