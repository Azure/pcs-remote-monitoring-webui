// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import { connect } from 'react-redux';
import { ControlLabel, FormGroup, ButtonToolbar } from "react-bootstrap";
import { isFunction } from "../../common/utils";
import ApiService from "../../common/apiService"
import lang from "../../common/lang";
import RuleTrigger from "../ruleTrigger/ruleTrigger";
import EditInput from "../editInput/editInput";
import enabled from "../../assets/icons/EnableToggle.svg";
import edit from "../../assets/icons/Edit.svg";
import disabled from "../../assets/icons/DISABLE_toggle.svg";
import critical from "../../assets/icons/Critical.svg";
import info from "../../assets/icons/Info.svg";
import warning from "../../assets/icons/Warning.svg";

import "./ruleEditor.css";

const Severity = [
    { text: lang.RULESACTIONS.CRITICAL, value: "critical", imgUrl: critical },
    { text: lang.RULESACTIONS.WARNING, value: "warning", imgUrl: warning },
    { text: lang.RULESACTIONS.INFO, value: "info", imgUrl: info }
];

class RuleEditImg extends React.Component {
    onHandleClick = () => {
        this.props.onClick(!this.props.isEdit);
    }

    render() {
        return (
            <div className={`edit-icon ${this.props.isEdit ? 'hide' : 'show'}`} onClick={this.onHandleClick}>
                <span className="icon"><img alt={lang.RULESACTIONS.EDIT} src={edit} /></span><span>{lang.RULESACTIONS.EDIT}</span>
            </div>
        );
    }
}

class RuleEnableImg extends React.Component {
    onHandleClick = () => {
        this.props.onClick(!this.props.isEnabled);
    }

    render() {
        const statusTxt = this.props.isEnabled ? lang.RULESACTIONS.ENABLED : lang.RULESACTIONS.DISABLED;
        return (
            <div>
                <span className={`icon ${this.props.isEdit ? 'show' : 'hide'}`} onClick={this.onHandleClick}><img alt={statusTxt} src={this.props.isEnabled ? enabled : disabled} /></span><span>{statusTxt}</span>
            </div>
        );
    }
}

class RuleEditor extends React.Component {
    constructor(props) {
        super(props);
        const { content } = this.props;
        this.state = {
            rule: content.rule || {
                Name: "",
                Enabled: true,
                Description: "",
                GroupId: "",
                Severity: Severity[0].value,
                Conditions: [
                ]
            },
            isEdit: content.rule ? (content.inEdit || false) : true,
            conditionFields: [],
            deviceCount: 0
        }
        this.getDeviceCount(this.state.rule.GroupId);
    }

    onEditClick = (isEdit) => {
        this.setState({ isEdit: isEdit })
    }

    onEnableClick = (isDisabled) => {
        const rule = this.state.rule;
        rule.Enabled = isDisabled;
        this.setState({ rule: rule });
    }

    onNameChange = (name) => {
        const rule = this.state.rule;
        rule.Name = name;
        this.setState({ rule: rule });
    }

    onDescriptionChange = (description) => {
        const rule = this.state.rule;
        rule.Description = description;
        this.setState({ rule: rule });
    }

    onSeverityLevelChange = (severity) => {
        const rule = this.state.rule;
        rule.Severity = severity;
        this.setState({ rule: rule });
    }

    onGroupIdChange = (groupId) => {
        const rule = this.state.rule;
        rule.GroupId = groupId;
        this.setState({ rule: rule });
        this.getDeviceCount(groupId);
    }

    onCreate() {
        this.getConditions();
        this.setState({ isEdit: false });
        if (this.state.rule.Id) {
            ApiService.updateRule(this.state.rule.Id, this.state.rule).catch((err) => {
                console.error(err);
            });
        } else {
            ApiService.createRule(this.state.rule).catch((err) => {
                console.error(err);
            });
        }
    }

    onCancel() {
        this.closeFlyout();
    }

    closeFlyout() {
        if (isFunction(this.props.onClose)) {
            this.props.onClose();
        }
    }

    getConditions() {
        const rule = this.state.rule;
        rule.Conditions = this.refs.conditions.getConditions();
        this.setState({ rule: rule });
    }

    getDeviceCount(groupId) {
        this.props.deviceGroups.forEach(group => {
            if (group.id === groupId) {
                ApiService.getDevicesForGroup(group.conditions).then((data) => {
                    if (data && data.items) {
                        this.setState({ deviceCount: data.items.length });
                        this.setState({ conditionFields: this.getConditionFields(data.items) });;
                    }
                });
            }
        });
    }

    getConditionFields(devices) {
        const fields = [];
        devices.forEach(device => {
            const telemetry = device.Properties.Reported.Telemetry;
            if (telemetry) {
                Object.keys(telemetry).forEach((field) => {
                    const extract = field.match(/-(.*);/).pop();
                    if (!fields.some((o) => o.value === extract)) {
                        fields.push({
                            label: extract,
                            value: extract
                        });
                    }
                });
            }
        });
        return fields;
    }

    render() {
        const deviceGroups = this.props.deviceGroups;
        let deviceGroupOptions = deviceGroups.map((group, idx) => {
            return {
                value: group.id,
                label: group.displayName
            };
        });

        return (
            <div className="rule-editor">
                <div className="rule-editor-body">
                    <FormGroup>
                        <div className="name-wrapper">
                            <EditInput className="input" type="text" placeholder={lang.RULESACTIONS.ENTERRULENAME} value={this.state.rule.Name} isEdit={this.state.isEdit} onChange={this.onNameChange} />
                        </div>
                        <RuleEditImg isEdit={this.state.isEdit} onClick={this.onEditClick} />
                    </FormGroup>
                    <FormGroup>
                        <EditInput type="textarea" className="textarea" classForLabel="description" placeholder={lang.RULESACTIONS.ENTERRULEDISCRIPTION} value={this.state.rule.Description} isEdit={this.state.isEdit} onChange={this.onDescriptionChange} />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{lang.RULESACTIONS.SOURCE}</ControlLabel>
                        <span className="help-text">{lang.RULESACTIONS.SOURCEHELP}</span>
                        <EditInput type="select" className="input" placeholder={lang.RULESACTIONS.SELECTDEVICEGROUP} options={deviceGroupOptions} value={this.state.rule.GroupId} isEdit={this.state.isEdit} onChange={this.onGroupIdChange} />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{lang.RULESACTIONS.TRIGGER}</ControlLabel>
                        <RuleTrigger fields={this.state.conditionFields} conditions={this.state.rule.Conditions} isEdit={this.state.isEdit} ref="conditions" />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{lang.RULESACTIONS.SEVERITYLEVEL}</ControlLabel>
                        <EditInput type="radio" options={Severity} value={this.state.rule.Severity} isEdit={this.state.isEdit} onChange={this.onSeverityLevelChange} />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{lang.RULESACTIONS.RULESTATUS}</ControlLabel>
                        <RuleEnableImg isEdit={this.state.isEdit} isEnabled={this.state.rule.Enabled} onClick={this.onEnableClick} />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{lang.RULESACTIONS.SUMMARY}</ControlLabel>
                        <div className="ruleTip"><span className="device-count">{this.state.deviceCount}</span><span className="help-text">{lang.RULESACTIONS.DEVICECOUNT}</span></div>
                    </FormGroup>
                    <FormGroup className={this.state.isEdit ? "show" : "hide"}>
                        <div className="help-text">{lang.RULESACTIONS.NOTE}</div>
                    </FormGroup>
                </div>
                <div className={`rule-editor-btns ${this.state.isEdit ? 'show' : 'hide'}`}>
                    <ButtonToolbar className="btn-tool-bar">
                        <button className="button" onClick={() => this.onCancel()}><img src="/static/media/CancelX.fe4be2c5.svg" alt="/static/media/CancelX.fe4be2c5.svg" className="cancel-icon" />{lang.RULESACTIONS.CANCEL}</button>
                        <button className="button" onClick={() => this.onCreate()}><img src="/static/media/Apply.2f9ac34d.svg" height="10" alt="/static/media/Apply.2f9ac34d.svg" className="apply-icon" />{lang.RULESACTIONS.APPLY}</button>
                    </ButtonToolbar>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    deviceGroups: state.filterReducer.deviceGroups
});

export default connect(mapStateToProps, null)(RuleEditor);
