// Copyright (c) Microsoft. All rights reserved.

import { Component } from 'react';
import update from 'immutability-helper';

import { isFunc, isDef } from 'utilities';

/** Contains logic for validating a value */
export class Validator {

  static notEmpty = x => {
    if (Array.isArray(x)) return x.length > 0;
    if (typeof x === 'number') return true;
    return !!x;
  }

  constructor(validator = {}) {
    this.validators = validator.validators || [];
    this.rejectors = validator.rejectors || [];
  }

  /**
   * Adds a checking function to the validator list
   * If the function returns false, validation fails
   */
  check(checker, msg = true) {
    this.validators = [
      ...this.validators,
      value => (checker(value) ? '' : (isFunc(msg) ? msg(value) : msg))
    ];
    return this;
  }

  /**
   * Adds a rejection function to the rejector list
   * If the function returns false, the value is rejected
   */
  reject(rejector) {
    this.rejectors =  [ ...this.rejectors, rejector ];
    return this;
  }

  shouldReject(value) {
    return this.rejectors.some(rejector => rejector(value));
  }

  hasErrors(value) {
    let error = '';
    for (let i = 0; i < this.validators.length; i++) {
      error = this.validators[i](value);
      if (error) return error;
    }
    return error;
  }

}

/** Links to a part of a component state */
export class Link extends Validator {

  /** Accepts either an existing link or a component and state key name */
  constructor() {
    super();

    if (arguments.length === 1 && arguments[0] instanceof Link) {
      const [ link ] = arguments;
      this.component = link.component;
      this.setter = link.setter;
      this.selector = link.selector;
    } else if (arguments.length >= 2) {
      const [ component, name ] = arguments;
      this.component = component;
      this.setter = value => ({ [name]: value });
      this.selector = state => state[name];
    } else {
      throw new Error('Link class: Invalid constructor signature.');
    }

    this.mappers = [];
  }

  onChange = ({ target: { value, type, checked } }) => {
    if (this.shouldReject(value)) return;
    const finalVal = this.mappers.reduce(
      (val, mapFunc) => mapFunc(val),
      type === 'checkbox' ? checked : value
    );
    this.set(finalVal);
  };

  /** Links to property in the component state */
  to = (name) => {
    const { selector, setter } = this;
    this.setter = value => setter({ [name]: value });
    this.selector = state => selector(state)[name];
    return this;
  };

  /** Adds a function for mapping an input value to a new value */
  map = (func) => {
    this.mappers = [ ...this.mappers, func ];
    return this;
  };

  /**
   * Updates the value of the component state property the Link is
   * connected to.
   */
  set(value) {
    this.component.setState(
      update(this.component.state, this.setter({ $set: value }))
    );
    return this;
  }

  get value() {
    // In case the user defaults a value to be undefined, always default to the empty string
    // to prevent switching between a controlled and uncontrolled input
    const val = this.selector(this.component.state);
    return isDef(val) ? val : '';
  }

  get error() {
    return this.hasErrors(this.value);
  }

  /** Allows the link to use predefined validator logic */
  withValidator(validator) {
    this.validators = validator.validators;
    this.rejectors = validator.rejectors;
    return this;
  }

  /** A helper method for array state properties */
  getLinkedChildren = (mapFunc) => {
    return this.value.map((_, idx) => mapFunc(this.forkTo(idx), idx));
  }

  /**
   * Used to create a new Link instance using the state property hierarchy of an
   * existing instance
   */
  forkTo = (name) => (new Link(this)).to(name);

}

/** A helper for creating components with links into the component state */
export class LinkedComponent extends Component {
  linkTo = name => new Link(this, name);
}
