// Copyright (c) Microsoft. All rights reserved.

import React, {Component} from "react";

import lang from "../../common/lang";

import "./ruleOverview.css";
import ApiService from "../../common/apiService";
import {connect} from "react-redux";

class RuleOverviewFlyout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            enabled: props.content.selectedRules.some(rule => rule.Enabled !== props.content.selectedRules[0].Enabled) ? true : props.content.selectedRules[0].Enabled
        };
    }

    onToggleStatus = () => {
        this.setState({enabled: !this.state.enabled});
    };

    onSave = () => {
        let promises = [];
        let updatedRules = [];
        const rules = this.props.rules || this.props.content.selectedRules;
        rules.forEach(rule => {
            if (rule.Enabled !== this.state.enabled) {
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
        const rules =  this.props.rules || this.props.content.selectedRules;
        const overviewItems = rules.map(rule => {
            return (
                <div className="overview-item">
                    <div className="title">{rule.Name}</div>
                    <div className="description">{rule.Description}</div>
                    <div className="effectNumber">
                        <div className="count">{rule.DeviceCount || 0}</div>
                        <div className="text">{lang.EFFECTEDDEVICES}</div>
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
                            className="text">{this.state.enabled ? lang.ENABLESELECTEDRULE : lang.DISABLESELECTEDRULE}</div>
                    </div>
                </div>
                <div className="divider"/>
                <div className="rule-overview-body">
                    {overviewItems}
                </div>
                <div className="divider"/>
                <div className="rule-overview-summary">
                    <div className="title">{lang.SUMMARY} </div>
                    <div className="description"> {lang.NOTE} </div>
                </div>
                <div className="rule-overview-footer">
                    <button className="button button-save" onClick={() => this.onSave()}>{lang.SAVE} </button>
                    <button className="button button-cancel" onClick={this.props.onClose}>{lang.CANCEL} </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { rules: state.flyoutReducer.rules };
};

export default connect(mapStateToProps, null)(RuleOverviewFlyout);

