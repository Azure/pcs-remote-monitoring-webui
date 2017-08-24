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
import disabled from "../../assets/icons/Disabled.svg";

import "./ruleEditor.css";

const Severity = [{ text: lang.RULESACTIONS.CRITICAL, value: "critical" }, { text: lang.RULESACTIONS.WARNING, value: "warning" }, { text: lang.RULESACTIONS.INFO, value: "info" }];

class RuleEditImg extends React.Component {
    onHandleClick = () => {
        this.props.onClick(!this.props.isEdit);
    }

    render() {
        return (
            <div className="editIcon">
                <span style={{ display: this.props.isEdit ? "none" : "inline-block" }}>{lang.RULESACTIONS.EDIT} <img alt={lang.RULESACTIONS.EDIT} src={edit} onClick={this.onHandleClick} /></span>
            </div>
        );
    }
}

class RuleEnableImg extends React.Component {
    onHandleClick = () => {
        this.props.onClick(!this.props.isDisabled);
    }

    render() {
        const statusTxt = this.props.isDisabled ? lang.RULESACTIONS.DISABLED : lang.RULESACTIONS.ENABLED;
        return (
            <div className="editIcon">
                <span style={{ display: this.props.isEdit ? "inline-block" : "none" }}>{statusTxt} <img alt={statusTxt} src={this.props.isDisabled ? disabled : enabled} onClick={this.onHandleClick} /></span>
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
            isEdit: content.rule ? false : true,
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

    onAlarmTextChange = (alarmText) => {
        console.log(alarmText);
    }

    onCreate() {
        this.getConditions();
        this.closeFlyout();
        ApiService.createRule(this.state.rule).catch((err) => {
            console.log(err);
        });
    }

    onUpdate() {
        this.getConditions();
        this.closeFlyout();
        ApiService.updateRule(this.state.rule.Id, this.state.rule).catch((err) => {
            console.log(err);
        });
    }

    onDelete() {
        this.closeFlyout();
        ApiService.deleteRule(this.state.rule.Id).catch((err) => {
            console.log(err);
        });;
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

    getDeviceGroups() {
        const deviceGroups = this.props.deviceGroups || [];
        const newGroupObj = {
            id: 0,
            displayName: 'Select...',
            conditions: []
        };
        return [newGroupObj, ...deviceGroups];
    }

    getDeviceCount(groupId) {
        this.props.deviceGroups.forEach(group => {
            if (group.id === groupId) {
                ApiService.getDevicesForGroup(group.conditions).then((data) => {
                    if (data && data.items) {
                        this.setState({ deviceCount: data.items.length });
                    }
                });
            }
        });
    }

    render() {
        const deviceGroups = this.getDeviceGroups();
        let deviceGroupOptions = deviceGroups.map((group, idx) => {
            return {
                value: group.id,
                label: group.displayName
            };
        });
        return (
            <div className="ruleEditor">
                <div className="ruleEditorMain">
                    <FormGroup>
                        <EditInput style={{ width: "50%", display: "inline-block" }} type="text" value={this.state.rule.Name} isEdit={this.state.isEdit} onChange={this.onNameChange} />
                        <RuleEditImg isEdit={this.state.isEdit} onClick={this.onEditClick} />
                        <RuleEnableImg isEdit={this.state.isEdit} isDisabled={this.state.rule.Enabled} onClick={this.onEnableClick} />
                    </FormGroup>
                    <FormGroup>
                        <EditInput type="textarea" value={this.state.rule.Description} isEdit={this.state.isEdit} onChange={this.onDescriptionChange} />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{lang.RULESACTIONS.SOURCE}</ControlLabel>
                        <span className="helpText">{lang.RULESACTIONS.SOURCEHELP}</span>
                        <EditInput type="select" options={deviceGroupOptions} value={this.state.rule.GroupId} isEdit={this.state.isEdit} onChange={this.onGroupIdChange} />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{lang.RULESACTIONS.TRIGGER}</ControlLabel>
                        <RuleTrigger conditions={this.state.rule.Conditions} isEdit={this.state.isEdit} ref="conditions" />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{lang.RULESACTIONS.SEVERITYLEVEL}</ControlLabel>
                        <EditInput type="radio" options={Severity} value={this.state.rule.Severity} isEdit={this.state.isEdit} onChange={this.onSeverityLevelChange} />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>{lang.RULESACTIONS.ALARMEVENT}</ControlLabel>
                        <span className="helpText">{lang.RULESACTIONS.ALARMEVENTHELP}</span>
                        <EditInput type="textarea" value={this.state.rule.Description} isEdit={this.state.isEdit} onChange={this.onAlarmTextChange} />
                    </FormGroup>
                    <FormGroup>
                        <div className="ruleTip"><span className="deviceNum">{this.state.deviceCount}</span><span className="helpText">{lang.RULESACTIONS.DEVICECOUNT}</span></div>
                    </FormGroup>
                </div>
                <div className="ruleEditorBtns" style={{ display: this.state.isEdit ? "block" : "none" }}>
                    <ButtonToolbar className="btnToolBar" style={{ display: this.state.rule.Id ? "block" : "none" }}>
                        <button className="ruleEditorBtn" onClick={() => this.onCancel()}>{lang.RULESACTIONS.CANCEL}</button>
                        <button className="ruleEditorBtn" onClick={() => this.onUpdate()}>{lang.RULESACTIONS.UPDATE}</button>
                        <button className="ruleEditorBtn" onClick={() => this.onDelete()}>{lang.RULESACTIONS.DELETE}</button>
                    </ButtonToolbar>
                    <ButtonToolbar className="btnToolBar" style={{ display: this.state.rule.Id ? "none" : "block" }}>
                        <button className="ruleEditorBtn" onClick={() => this.onCancel()}>{lang.RULESACTIONS.CANCEL}</button>
                        <button className="ruleEditorBtn" onClick={() => this.onCreate()}>{lang.RULESACTIONS.CREATE}</button>
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