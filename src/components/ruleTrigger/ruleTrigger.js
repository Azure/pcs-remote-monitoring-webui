// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import { Table } from "react-bootstrap";
import lang from "../../common/lang";
import EditInput from "../editInput/editInput";
import del from "../../assets/icons/Delete.svg";
import edit from "../../assets/icons/Edit.svg";
import add from "../../assets/icons/Add.svg";

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

    onNewFieldChange = (e) => {
        const condition = this.state.condition;
        condition.field = e.target.value;
        this.setState({ condition: condition });
    }

    onNewOperatorChange = (e) => {
        const condition = this.state.condition;
        condition.operator = e.target.value;
        this.setState({ condition: condition });
    }

    onNewValueChange = (e) => {
        const condition = this.state.condition;
        condition.value = e.target.value;
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
        return (
            <div className="ruleTrigger">
                <Table>
                    <thead>
                        <tr>
                            <td>{lang.RULESACTIONS.TH_FIELD}</td>
                            <td>{lang.RULESACTIONS.TH_OPERATOR}</td>
                            <td>{lang.RULESACTIONS.TH_VALUE}</td>
                            <td>{lang.RULESACTIONS.TH_ACTIONS}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" value={this.state.condition.field} onBlur={this.addCondition} onChange={this.onNewFieldChange} /></td>
                            <td><input type="text" value={this.state.condition.operator} onBlur={this.addCondition} onChange={this.onNewOperatorChange} /></td>
                            <td><input type="text" value={this.state.condition.value} onBlur={this.addCondition} onChange={this.onNewValueChange} /></td>
                            <td></td>
                        </tr>
                        {
                            this.state.conditions.map((c, i) => {
                                return <tr key={i}>
                                    <td><EditInput type="text" isEdit={c.isEdit} value={c.Field} onChange={(value) => this.onFieldChange(value, i)} /></td>
                                    <td><EditInput type="text" isEdit={c.isEdit} value={c.Operator} onChange={(value) => this.onOperatorChange(value, i)} /></td>
                                    <td><EditInput type="text" isEdit={c.isEdit} value={c.Value} onChange={(value) => this.onValueChange(value, i)} /></td>
                                    <td>
                                        <img src={add} alt={lang.RULESACTIONS.IMGSAVE} style={{ display: c.isEdit ? "inline-block" : "none" }} onClick={() => this.onUpdateClick(i)} />
                                        <img src={edit} alt={lang.RULESACTIONS.IMGEDIT} style={{ display: c.isEdit ? "none" : "inline-block" }} onClick={() => this.onEditClick(i)} />
                                        <img src={del} alt={lang.RULESACTIONS.IMGDELETE} onClick={() => this.onDeleteClick(i)} />
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </Table>
            </div>
        );
    }

    renderReadOnlyTrigger() {
        return (
            <div className="ruleReadTrigger">
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
                                return <tr>
                                    <td>{c.Field}</td>
                                    <td>{c.Operator}</td>
                                    <td>{c.Value}</td>
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
