// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import {
  Btn,
  BtnToolbar,
  FormControl,
  FormGroup,
  FormLabel
} from 'components/shared';
import { svgs, LinkedComponent } from 'utilities';
import Flyout from 'components/shared/flyout';

import './ruleNew.css';

const Section = Flyout.Section;

// A counter for creating unique keys per new condition
let conditionKey = 0;

// Creates a state object for a condition
const newCondition = () => ({
  value: '',
  key: conditionKey++ // Used by react to track the rendered elements
});

// TODO: Translate all the hard coded strings
export class RuleNew extends LinkedComponent {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      conditions: [ newCondition() ] // Start with one condition
    };

    // State links
    this.ruleName = this.linkTo('name');
    this.description = this.linkTo('description');
    this.conditions = this.linkTo('conditions');
  }

  addCondition = () => this.conditions.set([ ...this.conditions.value, newCondition() ]);

  deleteCondition = (index) =>
    () => this.conditions.set(this.conditions.value.filter((_, idx) => index !== idx));

  createRule = (event) => {
    event.preventDefault();
    console.log('TODO: Handle the form submission');
  }

  render() {
    const { onClose } = this.props;

    // Create the state link for the dynamic form elements
    const conditionLinks = this.conditions.getLinkedChildren(conditionLink => {
      const value = conditionLink.forkTo('value');
      return { value };
    });

    return (
      <Flyout.Container>
        <Flyout.Header>
          <Flyout.Title>New Rule</Flyout.Title>
          <Flyout.CloseBtn onClick={onClose} />
        </Flyout.Header>
        <Flyout.Content className="new-rule-flyout-container">
          <form onSubmit={this.createRule}>
            <Section.Container className="rule-property-container">
              <Section.Content>
              <FormGroup>
                <FormLabel>Rule name</FormLabel>
                <FormControl
                  type="text"
                  placeholder="Rule name"
                  link={this.ruleName} />
              </FormGroup>
              <FormGroup>
                <FormLabel>Description</FormLabel>
                <FormControl
                  type="textarea"
                  placeholder="Description"
                  link={this.description} />
              </FormGroup>
              </Section.Content>
            </Section.Container>

            <Section.Container collapsable={false}>
              <Section.Header>Conditions</Section.Header>
              <Section.Content>
                <Btn svg={svgs.plus} onClick={this.addCondition}>Add condition</Btn>
              </Section.Content>
            </Section.Container>
            {
              conditionLinks.map((condition, idx) => (
                <Section.Container key={this.state.conditions[idx].key}>
                  <Section.Header>Condition {idx + 1}</Section.Header>
                  <Section.Content>
                  {
                    conditionLinks.length > 1 &&
                    <Btn svg={svgs.trash} onClick={this.deleteCondition(idx)}>Delete</Btn>
                  }
                  <FormGroup>
                    <FormLabel>Value</FormLabel>
                    <FormControl
                      type="text"
                      placeholder="Value"
                      link={condition.value} />
                  </FormGroup>
                  </Section.Content>
                </Section.Container>
              ))
            }
            <BtnToolbar>
              <Btn type="submit">Submit</Btn>
            </BtnToolbar>
          </form>
        </Flyout.Content>
      </Flyout.Container>
    );
  }
}
