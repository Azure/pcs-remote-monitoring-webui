// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import { Table } from "react-bootstrap";
import lang from "../../common/lang";
import Config from '../../common/config';
import EditInput from "../editInput/editInput";
import del from "../../assets/icons/Delete.svg";

import "./ruleTrigger.css";

class RuleTrigger extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conditions: this.props.conditions || [],
            condition: {
                field: "",
                operator: "",
                value: ""
            }
        }
        this.state.conditions.forEach((ele) => {
            ele.isEdit = false;
        });
    }

    addCondition = () => {
        const condition = this.state.condition;
        if (condition.field && condition.operator && condition.value) {
            const conditions = this.state.conditions;
            conditions.push({
                Field: condition.field,
                Operator: condition.operator,
                Value: condition.value,
            });
            this.setState({
                conditions: conditions,
            });
            condition.field = "";
            condition.operator = "";
            condition.value = "";
            this.setState({
                condition: condition
            });
        }
    }

    onNewFieldChange = (field) => {
        const condition = this.state.condition;
        condition.field = field;
        this.setState({ condition: condition });
        this.addCondition();
    }

    onNewOperatorChange = (operator) => {
        const condition = this.state.condition;
        condition.operator = operator;
        this.setState({ condition: condition });
        this.addCondition();
    }

    onNewValueChange = (value) => {
        const condition = this.state.condition;
        condition.value = value;
        this.setState({ condition: condition });
    }

    onEditClick(index) {
        const conditions = this.state.conditions;
        conditions[index].isEdit = true;
        this.setState({ conditions: conditions });
    }

    onDeleteClick(index) {
        setTimeout(() => {
            this.state.conditions.splice(index, 1);
            this.setState({ conditions: this.state.conditions });
        }, 0)
    }

    onUpdateClick(index) {
        const conditions = this.state.conditions;
        conditions[index].isEdit = false;
        this.setState({ conditions: conditions });
    }

    onBlur(index, event) {
        var currentTarget = event.currentTarget; 
        setTimeout(() => { 
            if (!currentTarget.contains(document.activeElement)) { 
                this.onUpdateClick(index);
            } 
        }); 
    }

    onValueChange(value, index) {
        const conditions = this.state.conditions;
        conditions[index].Value = value;
        this.setState({ conditions: conditions });
    }

    onFieldChange(field, index) {
        const conditions = this.state.conditions;
        conditions[index].Field = field;
        this.setState({ conditions: conditions });
    }

    onOperatorChange(operator, index) {
        const conditions = this.state.conditions;
        conditions[index].Operator = operator;
        this.setState({ conditions: conditions });
    }

    getConditions = () => {
        return this.state.conditions;
    }

    renderEditTrigger() {
        const OperatorOptions = Config.OPERATOR_OPTIONS;

        return (
            <div className="rule-trigger">
                <div>
                    <div className="condition-head">{lang.RULESACTIONS.TH_FIELD}</div>
                    <div className="condition-head">{lang.RULESACTIONS.TH_OPERATOR}</div>
                    <div className="condition-head">{lang.RULESACTIONS.TH_VALUE}</div>
                    <div className="condition-action">{lang.RULESACTIONS.TH_ACTIONS}</div>
                </div>
                <div className="condition-row">
                    <div className="condition-field"><EditInput type="select" isEdit={true} value={this.state.condition.field} options={this.props.fields} onChange={(value) => this.onNewFieldChange(value)} /></div>
                    <div className="condition-field"><EditInput type="select" isEdit={true} value={this.state.condition.operator} options={OperatorOptions} onChange={(value) => this.onNewOperatorChange(value)} /></div>
                    <div className="condition-field"><EditInput type="text" isEdit={true} placeholder={lang.RULESACTIONS.ENTERVALUE} className="value" value={this.state.condition.value} onBlur={this.addCondition} onChange={(value) => this.onNewValueChange(value)} /></div>
                    <div className="condition-action"></div>
                </div>
                {
                    this.state.conditions.map((c, i) => {
                        return <div className="condition-row" key={i}>
                            <div className={!c.isEdit ? 'editable' : null} onClick={() => this.onEditClick(i)} onBlur={(e) => this.onBlur(i, e)} >
                                <div className="condition-field"><EditInput type="select" isEdit={c.isEdit} value={c.Field} options={this.props.fields} onChange={(value) => this.onFieldChange(value, i)} /></div>
                                <div className="condition-field"><EditInput type="select" isEdit={c.isEdit} value={c.Operator} options={OperatorOptions} onChange={(value) => this.onOperatorChange(value, i)} /></div>
                                <div className="condition-field"><EditInput type="text" className="value" isEdit={c.isEdit} value={c.Value} onChange={(value) => this.onValueChange(value, i)} autoFocus={true} /></div>
                            </div>
                            <div className="condition-action">
                                <span className="condition-action-img">
                                     <img src={del} alt={lang.RULESACTIONS.IMGDELETE} onClick={() => this.onDeleteClick(i)} />
                                </span>
                            </div>
                        </div>
                    })
                }
            </div>
        );
    }

    renderReadOnlyTrigger() {
        return (
            <div className="rule-read-trigger">
                <Table>
                    <thead>
                        <tr>
                            <td>{lang.RULESACTIONS.TH_FIELD}</td>
                            <td>{lang.RULESACTIONS.TH_OPERATOR}</td>
                            <td>{lang.RULESACTIONS.TH_VALUE}</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.conditions.map((c, i) => {
                                return <tr key={i}>
                                    <td><EditInput type="select" isEdit={false} value={c.Field} options={this.props.fields} /></td>
                                    <td><EditInput type="select" isEdit={false} value={c.Operator} options={Config.OPERATOR_OPTIONS} /></td>
                                    <td><EditInput type="text" isEdit={false} value={c.Value} /></td>
                                </tr>
                            })
                        }
                    </tbody>
                </Table>
            </div>
        );
    }

    renderTrigger() {
        if (this.props.isEdit) {
            return this.renderEditTrigger();
        } else {
            return this.renderReadOnlyTrigger();
        }
    }

    render() {
        return (
            this.renderTrigger()
        );
    }
}

export default RuleTrigger;
