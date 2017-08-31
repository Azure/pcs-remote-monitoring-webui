// Copyright (c) Microsoft. All rights reserved.

import React, {Component} from "react";

import lang from "../../common/lang";

import "./ruleOverview.css";
import ApiService from "../../common/apiService";

export default class RuleOverviewFlyout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rules: props.content.selectedRules || []
        };

        this.origRules = Array.from(props.content.selectedRules.map(rule => {
                return {
                    Enabled: rule.Enabled,
                    Id: rule.Id
                }
            }) || []); // Clone the rules props
    }

    onToggleStatus = (event, index) => {
        let rules = Array.from(this.state.rules);
        rules[index].Enabled = !rules[index].Enabled;
        this.setState({rules: rules});
    };

    onSave = () => {
        let promises = [];
        for (let i = 0; i < this.state.rules.length; i++) {
            if (this.origRules[i].Enabled !== this.state.rules[i].Enabled) {
                promises.push(ApiService.updateRule(this.origRules[i].Id,this.state.rules[i]));
            }
        }
        Promise.all(promises).then(result => {
            // TODO:check return value is correct
        }).catch(err => {
            console.error(err);
        });

        this.props.onClose();
    };

    componentWillReceiveProps(nextProps) {
        this.setState({rules: nextProps.content.selectedRules || []});
        this.origRules = nextProps.content.selectedRules.map(rule => {
            return {
                Enabled: rule.Enabled,
                Id: rule.Id
            }
        });
    }

    render() {

        const overviewItems = this.state.rules.map((rule, index) => {
            return (
                <div className="overview-item">
                    <div className="toggle-button">
                        <div className={`icon ${rule.Enabled ? 'icon-enabled' : 'icon-disabled'}`}/>
                        <div
                            className="text">{rule.Enabled ? lang.RULESACTIONS.ENABLED : lang.RULESACTIONS.DISABLED}</div>
                        <div onClick={(event) => this.onToggleStatus(event, index)}
                             className={`icon ${!rule.Enabled ? 'icon-enable' : 'icon-disable'}`}/>
                    </div>
                    <div className="title">{rule.Name}</div>
                    <div className="description">{rule.Description}</div>
                    <div className="effectNumber">
                        <div className="count">{rule.DeviceCount}</div>
                        <div className="text">{lang.RULESACTIONS.EFFECTEDDEVICES}</div>
                    </div>
                    <div className="divider"/>
                </div>
            )
        });
        return (
            <div className="rule-overview-flyout">
                <div className="rule-overview-body">
                {overviewItems}
                </div>
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
