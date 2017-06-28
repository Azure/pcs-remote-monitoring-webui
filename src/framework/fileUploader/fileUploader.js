// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import Http from '../../common/httpClient';
import Utils from '../../common/utils';

export default class FileUploader extends React.Component{
    constructor(props) {
        super(props);

        this.options = this.props.options || {
            showPath: false,
            showProgress: false,
            acceptContentTypes: "image/gif, image/jpeg, image/png",
            maxSizeInMB: 10
        };
    }

    browse() {
        this.refs.file.click();
    }

    upload() {
        var data = new FormData();
        data.append("file", this.file);
        Http.ajax(this.props.url, {
            method: 'POST',
            body: data
        }).then((response) => {
            return response.json();
        }).then((result) => {
            if (Utils.isFunction(this.props.onUploaded)) {
                this.props.onUploaded(result);
            }
        });
    }

    fileChanged = (e) => {
        this.file = e.target.files[0];
        if (this.file && this.options.maxSizeInMB && this.file.size > this.options.maxSizeInMB * 1024 * 1024) {
            //TODO: show error
        } 
        else {
            this.upload();
        }
    }

    render() {
        return (
            <form>
                <input ref="file" type="file" size="1" style={{display:'none'}} onChange={this.fileChanged} accept={this.options.acceptContentTypes} hidefocus />
            </form>
        );
    }
}

