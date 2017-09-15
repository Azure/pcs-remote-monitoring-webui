// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import ProfileImage from '../../assets/icons/ProfileImage.png';
import auth from "../../common/auth";
import ApiService from '../../common/apiService';
import lang from "../../common/lang";

import './profile.css';

class Profile extends Component {

    userName = ""

    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
        ApiService.getCurrentUser().then(user => {
            if (user) {
                this.userName = user.Name;
            }
        });
    }

    show = () => {
        this.setState({ show: !this.state.show });
    }

    switchUser() {
        auth.logout();
    }

    render() {
        return (
            <span className="profile">
                <img
                    className="topNavIcon"
                    src={ProfileImage}
                    alt="ProfileImage"
                    onClick={this.show}
                    title={this.userName}
                />
                {this.state.show &&
                    <ul className="profileDropdown">
                        <li>
                            <span onClick={this.switchUser}>{lang.NAVIGATION.SWITCHUSER}</span>
                        </li>
                    </ul>
                }
            </span>
        );
    }
}

export default Profile;