// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import { Radio } from "react-bootstrap";
import Select from 'react-select';
import lang from "../../common/lang";

import "./editInput.css";

const TextInput = ({ ...props }) => {
    return (
        <input type="text" {...props} />
    );
}

const TextareaInput = ({ text, ...props }) => {
    return (
        <textarea {...props} defaultValue={text} ></textarea>
    );
}

const SelectInput = ({ options, value, className, onChange, placeholder }) => {
    return (
        <Select
            options={options}
            value={value}
            simpleValue
            placeholder={placeholder || lang.DROUPDOWNPLACEHOLDER}
            className={`field-select${className ? ' ' + className : ''}`}
            onChange={onChange}
        />
    );
}

const RadioInput = ({ options, name, value, ...props }) => {
    return (
        <span>
            {
                options.map((s, i) => {
                    return <Radio key={i} value={s.value} name={name} checked={value === s.value} {...props}><span className="radio-img"><img alt={s.text} src={s.imgUrl} /></span>{s.text}</Radio>
                })

            }
        </span>
    );
}

class EditInput extends React.Component {
    onValueChange = (e) => {
        this.props.onChange(e.target.value);
    }

    onSelectValueChange = (value) => {
        this.props.onChange(value);
    }

    getPropertyFromOptions(options, value, label) {
        var property = "";
        options.some((option) => {
            if (value === option.value) {
                property = option[label];
                return true;
            }
            return false;
        })
        return property;
    }

    renderInput() {
        const type = this.props.type;
        if (this.props.isEdit) {
            switch (type) {
                case "text":
                    return <TextInput value={this.props.value} className={this.props.className} placeholder={this.props.placeholder} onChange={this.onValueChange} onBlur={this.props.onBlur} autoFocus={this.props.autoFocus} />
                case "textarea":
                    return <TextareaInput text={this.props.value} className={this.props.className} placeholder={this.props.placeholder} onChange={this.onValueChange} />
                case "select":
                    return <SelectInput options={this.props.options} className={this.props.className} placeholder={this.props.placeholder} value={this.props.value} onChange={this.onSelectValueChange} />
                case "radio":
                    return <RadioInput name="rd" options={this.props.options} className={this.props.className} value={this.props.value} onChange={this.onValueChange} />
                default:
                    return null
            }
        } else {
            if (type === "radio") {
                const imgUrl = this.getPropertyFromOptions(this.props.options, this.props.value, "imgUrl");
                const displayName = this.getPropertyFromOptions(this.props.options, this.props.value, "text");
                return <label title={displayName}><span className="radio-img"><img alt={displayName} src={imgUrl} /></span>{displayName}</label>
            } else if (type === "select") {
                const displayName = this.getPropertyFromOptions(this.props.options, this.props.value, "label");
                return <label className={this.props.classForLabel || ""}>{displayName}</label>
            }

            return <label className={this.props.classForLabel || ""}>{this.props.value}</label>
        }
    }

    render() {
        return (
            <div className="edit-input">
                {
                    this.renderInput()
                }
            </div>
        );
    }
}

export default EditInput;