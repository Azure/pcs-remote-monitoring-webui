// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import {
  Btn,
  BtnToolbar,
  FormControl,
  FormGroup,
  FormLabel,
  Radio,
  ToggleBtn
} from 'components/shared';
import { SeverityRenderer } from 'components/shared/cellRenderers';
import { Validator, svgs, LinkedComponent } from 'utilities';
import Flyout from 'components/shared/flyout';

import './ruleNew.css';

const Section = Flyout.Section;

const ruleNameValidator = (new Validator()).check(Validator.notEmpty, 'Name is required');

// A counter for creating unique keys per new condition
let conditionKey = 0;

// Creates a state object for a condition
const newCondition = () => ({
  field: '',
  calculation: '',
  timePeriod: {
    hours: '',
    minutes: '',
    seconds: ''
  },
  operator: '',
  value: '',
  key: conditionKey++ // Used by react to track the rendered elements
});

export class RuleNew extends LinkedComponent {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      deviceGroup: '',
      conditions: [newCondition()], // Start with one condition
      severityLevel: {
        critical: true,
        warning: false,
        info: false
      },
      ruleStatus: true,
      devicesAffected: 0
    };

    // State links
    this.ruleNameLink = this.linkTo('name');
    this.descriptionLink = this.linkTo('description');
    this.deviceGroupLink = this.linkTo('deviceGroup');
    this.conditionsLink = this.linkTo('conditions');
  }

  addCondition = () => this.conditions.set([...this.conditions.value, newCondition()]);

  deleteCondition = (index) =>
    () => this.conditions.set(this.conditions.value.filter((_, idx) => index !== idx));

  createRule = (event) => {
    event.preventDefault();
    console.log('TODO: Handle the form submission');
  }

  render() {
    const { onClose, t } = this.props;
    const name = this.ruleNameLink.forkTo('name')
      .withValidator(ruleNameValidator);
    // Create the state link for the dynamic form elements
    const conditionLinks = this.conditionsLink.getLinkedChildren(conditionLink => {
      const fieldLink = conditionLink.forkTo('field');
      return { fieldLink };
    });

    return (
      <Flyout.Container>
        <Flyout.Header>
          <Flyout.Title>{t(`rulesFlyout.newRule`)}</Flyout.Title>
          <Flyout.CloseBtn onClick={onClose} />
        </Flyout.Header>
        <Flyout.Content className="new-rule-flyout-container">
          <form onSubmit={this.createRule}>
            <Section.Container className="rule-property-container">
              <Section.Content>
                <FormGroup>
                  <FormLabel isRequired="true">{t(`rulesFlyout.ruleName`)}</FormLabel>
                  <FormControl
                    type="text"
                    className="long"
                    placeholder={t(`rulesFlyout.namePlaceholder`)}
                    link={name} />
                </FormGroup>
                <FormGroup>
                  <FormLabel>{t(`rulesFlyout.description`)}</FormLabel>
                  <FormControl
                    type="textarea"
                    placeholder={t(`rulesFlyout.descriptionPlaceholder`)}
                    link={this.descriptionLink} />
                </FormGroup>
                <FormGroup>
                  <FormLabel isRequired="true">{t(`rulesFlyout.deviceGroup`)}</FormLabel>
                  <FormControl
                    type="select"
                    className="long"
                    placeholder={t(`rulesFlyout.deviceGroupPlaceholder`)}
                    link={this.deviceGroupLink} />
                </FormGroup>
              </Section.Content>
            </Section.Container>

            <Section.Container collapsable={false}>
              <Section.Header>{t(`rulesFlyout.conditions`)}</Section.Header>
              <Section.Content>
                <Btn svg={svgs.plus} onClick={this.addCondition}>{t(`rulesFlyout.addCondition`)}</Btn>
              </Section.Content>
            </Section.Container>
            {
              conditionLinks.map((condition, idx) => (
                <Section.Container key={this.state.conditions[idx].key}>
                  <Section.Header>{t(`rulesFlyout.condition.condition`)} {idx + 1}</Section.Header>
                  <Section.Content>
                    {
                      conditionLinks.length > 1 &&
                      <Btn svg={svgs.trash} onClick={this.deleteCondition(idx)}>Delete</Btn>
                    }
                    <FormGroup>
                      <FormLabel isRequired="true">{t(`rulesFlyout.condition.field`)}</FormLabel>
                      <FormControl
                        type="select"
                        className="long"
                        placeholder={t(`rulesFlyout.condition.fieldPlaceholder`)}
                        link={condition.field} />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel isRequired="true">{t(`rulesFlyout.condition.calculation`)}</FormLabel>
                      <FormControl
                        type="select"
                        className="long"
                        placeholder={t(`rulesFlyout.condition.calculationPlaceholder`)}
                        link={condition.calculation} />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel isRequired="true">{t(`rulesFlyout.condition.timePeriod`)}</FormLabel>
                      <FormControl
                        type="duration"
                        className="long"
                        link={condition.timePeriod} />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel isRequired="true">{t(`rulesFlyout.condition.operator`)}</FormLabel>
                      <FormControl
                        type="select"
                        className="short"
                        placeholder={t(`rulesFlyout.condition.operatorPlaceholder`)}
                        link={condition.operator} />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel isRequired="true">{t(`rulesFlyout.condition.value`)}</FormLabel>
                      <FormControl
                        type="text"
                        placeholder={t(`rulesFlyout.condition.valuePlaceholder`)}
                        link={condition.value} />
                    </FormGroup>
                  </Section.Content>
                </Section.Container>
              ))
            }
            <Section.Container collapsable={false}>
              <Section.Header>{t(`rulesFlyout.severityLevel`)}</Section.Header>
              <Section.Content>
                <FormGroup>
                  <Radio
                    placeholder="critical"
                    checked={this.state.severityLevel.critical}>
                    <SeverityRenderer value="Critical" context={{ t }} iconOnly={false} />
                  </Radio>
                  <Radio
                    placeholder="warning"
                    checked={this.state.severityLevel.warning} >
                    <SeverityRenderer value="Warning" context={{ t }} iconOnly={false} />
                  </Radio>
                  <Radio
                    placeholder="info"
                    checked={this.state.severityLevel.info} >
                    <SeverityRenderer value="Info" context={{ t }} iconOnly={false} />
                  </Radio>
                </FormGroup>
              </Section.Content>
              <Section.Header>{t(`rulesFlyout.ruleStatus`)}</Section.Header>
              <Section.Content>
                <ToggleBtn value={this.state.ruleStatus}>Enabled</ToggleBtn>
              </Section.Content>
            </Section.Container>
            <Section.Container collapsable={false}>
              <Section.Content className="devices-affected">
                <div className="devices-affected-dynamic">{this.state.devicesAffected}</div>
                <div className="devices-affected-static">{t(`rulesFlyout.devicesAffected`)}</div>
              </Section.Content>
            </Section.Container>
            <BtnToolbar className="apply-cancel">
              <Btn type="submit">{t(`rulesFlyout.apply`)}</Btn>
              <Btn onClick={onClose}>{t(`rulesFlyout.cancel`)}</Btn>
            </BtnToolbar>
          </form>
        </Flyout.Content>
      </Flyout.Container>
    );
  }
}
