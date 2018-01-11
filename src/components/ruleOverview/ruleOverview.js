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
            enabled: props.rules.some(rule => rule.Enabled !== props.rules[0].Enabled) ? true : props.rules[0].Enabled
        };
    }

    onSave = () => {
        let promises = [];
        let updatedRules = [];
        this.props.rules.forEach(rule => {
            if (rule.Enabled === this.state.enabled) {
                rule.Enabled = !this.state.enabled;
            } else {
                rule.Enabled = this.state.enabled;
            }
            updatedRules.push(rule);
            promises.push(ApiService.updateRule(rule.Id, rule));
        });
        Promise.all(promises).then((rules) => {
            this.props.onUpdateData(rules);
        }).catch(err => {
            console.error(err);
        });

        this.props.onClose();
    };

    componentWillReceiveProps(nextProps) {
        if (!nextProps.rules || !nextProps.rules.length) {
            this.props.onClose();
        }
    }

    render() {
        const overviewItems = this.props.rules.map(rule => {
            return (
                <div className="overview-item">
                    <div className="title">{rule.Name}</div>
                    <div className="description">{rule.Description}</div>
                    <div className="effectNumber">
                        <div className="count">{rule.DeviceCount || 0}</div>
                        <div className="text">{lang.AFFECTEDDEVICES}</div>
                    </div>
                </div>
            )
        });
        return (
            <div className="rule-overview-flyout">
                <div className="clearfix"/>
                <div className="rule-overview-header">
                    <div className="toggle-button">
                        <div className={`icon ${this.state.enabled ? 'icon-disable': 'icon-enable'}`}/>
                        <div className="text">{this.state.enabled ? lang.DISABLESELECTEDRULE : lang.ENABLESELECTEDRULE}</div>
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
    return {
        rules: state.flyoutReducer.rules,
        onUpdateData: state.flyoutReducer.onUpdateData
    };
};

export default connect(mapStateToProps, null)(RuleOverviewFlyout);
