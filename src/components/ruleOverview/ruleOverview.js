// Copyright (c) Microsoft. All rights reserved.

import React, {Component} from "react";

import lang from "../../common/lang";

import "./ruleOverview.css";
import ApiService from "../../common/apiService";

export default class RuleOverviewFlyout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            enabled: props.content.selectedRules.some(rule => rule.Enabled !== props.content.selectedRules[0].Enabled) ? true: props.content.selectedRules[0].Enabled
        };
    }

    onToggleStatus = () => {
        this.setState({enabled: !this.state.enabled});
    };

    onSave = () => {
        let promises = [];
        let updatedRules = [];
        this.props.content.selectedRules.forEach( rule => {
            if(rule.Enabled !== this.state.enabled)
            {
                rule.Enabled = this.state.enabled;
                updatedRules.push(rule);
                promises.push(ApiService.updateRule(rule.Id, rule));
            }
        });
        Promise.all(promises).then(() => {
            this.props.content.onUpdateData(updatedRules);
        }).catch(err => {
            console.error(err);
        });

        this.props.onClose();
    };


    render() {

        const overviewItems = this.props.content.selectedRules.map(rule => {
            return (
                <div className="overview-item">
                    <div className="title">{rule.Name}</div>
                    <div className="description">{rule.Description}</div>
                    <div className="effectNumber">
                        <div className="count">{rule.DeviceCount}</div>
                        <div className="text">{lang.RULESACTIONS.EFFECTEDDEVICES}</div>
                    </div>
                </div>
            )
        });
        return (
            <div className="rule-overview-flyout">
                <div className="clearfix"/>
                <div className="rule-overview-header">
                    <div className="toggle-button">
                        <div onClick={this.onToggleStatus}
                             className={`icon ${!this.state.enabled ? 'icon-enable' : 'icon-disable'}`}/>
                        <div
                            className="text">{this.state.enabled ? lang.RULESACTIONS.ENABLESELECTEDRULE : lang.RULESACTIONS.DISABLESELECTEDRULE}</div>
                    </div>
                </div>
                <div className="divider"/>
                <div className="rule-overview-body">
                    {overviewItems}
                </div>
                <div className="divider"/>
                <div className="title">{lang.RULESACTIONS.SUMMARY} </div>
                <div className="description"> {lang.RULESACTIONS.NOTE} </div>
                <div className="rule-overview-footer">
                    <button className="button button-save" onClick={() => this.onSave()}>{lang.FLYOUT.SAVE} </button>
                    <button className="button button-cancel" onClick={this.props.onClose}>{lang.FLYOUT.CANCEL} </button>
                </div>
            </div>
        );
    }
};
