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
        <textarea {...props}>{text}</textarea>
    );
}

const SelectInput = ({ options, value, className, onChange, placeholder }) => {
    return (
        <Select
            autofocus
            options={options}
            value={value}
            simpleValue
            placeholder={placeholder || lang.RULESACTIONS.DROUPDOWNPLACEHOLDER}
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
                    return <Radio key={i} value={s.value} name={name} checked={i === 0 || value === s.value} {...props}><span className="radio-img"><img alt={s.text} src={s.imgUrl} /></span>{s.text}</Radio>
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

    renderInput() {
        const type = this.props.type;
        if (this.props.isEdit) {
            switch (type) {
                case "text":
                    return <TextInput value={this.props.value} className={this.props.className} placeholder={this.props.placeholder} onChange={this.onValueChange} onBlur={this.props.onBlur} />
                case "textarea":
                    return <TextareaInput text={this.props.value} className={this.props.className} placeholder={this.props.placeholder} onChange={this.onValueChange} />
                case "select":
                    return <SelectInput options={this.props.options} className={this.props.className} placeholder={this.props.placeholder} value={this.props.value} onChange={this.onSelectValueChange} />
                case "radio":
                    return <RadioInput name="rd" options={this.props.options} className={this.props.className} value={this.props.value} onClick={this.onValueChange} />
                default:
                    return null
            }
        } else {
            if (type === "radio") {
                var imgUrl = "";
                this.props.options.some((option) => {
                    if (this.props.value === option.value) {
                        imgUrl = option.imgUrl;
                        return true;
                    }
                    return false;
                })
                return <label title={this.props.value}><span className="radio-img"><img alt={this.props.value} src={imgUrl} /></span>{this.props.value}</label>
            }

            return <label className={this.props.classForLabel || ""} title={this.props.value}>{this.props.value}</label>
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