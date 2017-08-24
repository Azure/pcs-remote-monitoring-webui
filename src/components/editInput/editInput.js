// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import { Radio } from "react-bootstrap";

import "./editInput.css";

const TextInput = ({ ...props }) => {
    return (
        <input type="text" {...props} />
    );
}

const TextareaInput = ({ text, ...props }) => {
    return (
        <textarea {...props}>{text}</textarea>
    );
}

const SelectInput = ({ options, value, ...props }) => {
    return (
        <select {...props} value={value}>
            {options.map((v, i) => {
                return <option key={i} value={v.value} {...props} selected={value === v.value ? "selected" : ""}>{v.label}</option>
            })
            }
        </select>
    );
}

const RadioInput = ({ options, name, value, ...props }) => {
    return (
        <span>
            {
                options.map((s, i) => {
                    return <Radio key={i} value={s.value} name={name} checked={i === 0 || value === s.value} {...props}>{s.text}</Radio>
                })

            }
        </span>
    );
}

class EditInput extends React.Component {
    onValueChange(e) {
        this.props.onChange(e.target.value);
    }

    renderInput() {
        const type = this.props.type;
        if (this.props.isEdit) {
            switch (type) {
                case "text":
                    return <TextInput value={this.props.value} onChange={(event) => this.onValueChange(event)} />
                case "textarea":
                    return <TextareaInput text={this.props.value} onChange={(event) => this.onValueChange(event)} />
                case "select":
                    return <SelectInput options={this.props.options} value={this.props.value} onChange={(event) => this.onValueChange(event)} />
                case "radio":
                    return <RadioInput name="rd" options={this.props.options} value={this.props.value} onClick={(event) => this.onValueChange(event)} />
                default:
                    return null
            }
        } else {
            return <label>{this.props.value}</label>
        }
    }

    render() {
        return (
            <div className="editInput" style={this.props.style}>
                {
                    this.renderInput()
                }
            </div>
        );
    }
}

export default EditInput;