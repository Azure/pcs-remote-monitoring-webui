// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import ProfileImage from '../../assets/icons/ProfileImage.png';
import Oauth2client from "../../common/oauth2client";
import lang from "../../common/lang";

import './profile.css';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }

    }

    show = () => {
        this.setState({ show: !this.state.show });
    }

    switchUser() {
        Oauth2client.logout();
    }

    render() {
        const userName = Oauth2client.getUserName();
        return (
            <span className="profile">
                <img
                    className="topNavIcon"
                    src={ProfileImage}
                    alt="ProfileImage"
                    onClick={this.show}
                    title={userName}
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