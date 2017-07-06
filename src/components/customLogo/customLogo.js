// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Button } from 'react-bootstrap';
import Http from '../../common/httpClient';
import Config from '../../common/config';
import FileUploader from '../../framework/fileUploader/fileUploader';

import './customLogo.css';

export default class CustomLogo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.getData().then((data) => {
            this.setState({
                img: this.getImageUrl(data.logo)
            });
        });
    }

    submit() {
        return this.saveData(this.state).then(() => {
            console.log("Succeeded to call saveData");
        }).catch((e) => {
            var message = "Failed to call saveData. " + e.message;
            console.log(message);
            alert(message);
        });
    }

    getImageUrl(img) {
        return img + "?v=" + new Date().getTime();
    }

    getData() {
        return Http.get(Config.uiConfigApiUrl + "/api/v1/solution");
    }

    onUpload = () => {
        this.refs.fileUploader.browse();
    }

    onUploaded = (result) => {
        this.setState({ img: this.getImageUrl(result) });
    };

    saveData(data) {
        return Http.put(Config.uiConfigApiUrl + "/api/v1/solution/logo", data);
    }

    render() {
        return (
            <div>
                <div><Button onClick={this.onUpload}>Upload</Button></div>
                <div>
                    <img className="customLogoImg" src={this.state.img} alt="logo" />
                </div>
                <FileUploader ref="fileUploader" url={Config.uiConfigApiUrl + "api/v1/solution/logo"} onUploaded={this.onUploaded} />
            </div>
        );
    }
}


