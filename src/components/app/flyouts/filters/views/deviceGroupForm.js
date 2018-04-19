// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { svgs, LinkedComponent, Validator } from 'utilities';
import {
  Btn,
  BtnToolbar,
  FormControl,
  FormGroup,
  FormLabel,
} from 'components/shared';

import Flyout from 'components/shared/flyout';

const Section = Flyout.Section;

// A counter for creating unique keys per new condition
let conditionKey = 0;

// Creates a state object for a condition
const newCondition = () => ({
  field: undefined,
  operator: undefined,
  type: undefined,
  value: '',
  key: conditionKey++ // Used by react to track the rendered elements
});

const operators = ['EQ', 'GT', 'LT', 'GE', 'LE', '[]', '[', ']'];
const valueTypes = ['Number', 'Text'];

class DeviceGroupForm extends LinkedComponent {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      conditions: [newCondition()],
      isEdit: !!this.props.selectedDeviceGroup
    };

    // State to input links
    this.nameLink = this.linkTo('name')
      .check(Validator.notEmpty, () => this.props.t('deviceGroupsFlyout.errorMsg.nameCantBeEmpty'));
    this.conditionsLink = this.linkTo('conditions');
  }

  formIsValid() {
    return [
      this.nameLink,
      this.conditionsLink
    ].every(link => !link.error);
  }

  componentDidMount() {
    if (this.state.isEdit) {
      this.getFormState(this.props);
    }
  }

  getFormState = ({
    selectedDeviceGroup: {
      conditions, displayName
    }
  }) => {
    if (this.state.isEdit) {
      this.setState({
        name: displayName,
        conditions
      });
    }
  }

  toSelectOption = ({ id, name }) => ({ value: id, label: name });

  apply = (event) => {
    event.preventDefault();
    // TODO: calling new device group API
  };

  addCondition = () => this.conditionsLink.set([...this.conditionsLink.value, newCondition()]);

  deleteCondition = (index) =>
    () => this.conditionsLink.set(this.conditionsLink.value.filter((_, idx) => index !== idx));

  render () {
    const { t } = this.props;

    // Create the state link for the dynamic form elements
    const conditionLinks = this.conditionsLink.getLinkedChildren(conditionLink => {
      const field = conditionLink.forkTo('field')
        .check(Validator.notEmpty, t('deviceGroupsFlyout.errorMsg.fieldCantBeEmpty'));
      const operator = conditionLink.forkTo('operator')
        .check(Validator.notEmpty, t('deviceGroupsFlyout.errorMsg.operatorCantBeEmpty'));
      const value = conditionLink.forkTo('value')
        .check(Validator.notEmpty, t('deviceGroupsFlyout.errorMsg.valueCantBeEmpty'));
      const type = conditionLink.forkTo('type')
        .check(Validator.notEmpty, t('deviceGroupsFlyout.errorMsg.typeCantBeEmpty'));
      const edited = !(!field.value && !operator.value && !value.value && !type.value);
      const error = (edited && (field.error || operator.error || value.error || type.error)) || '';
      return { field, operator, value, type, edited, error };
    });

    const editedConditions = conditionLinks.filter(({ edited }) => edited);
    const conditionHasErrors = editedConditions.some(({ error }) => !!error);
    const conditionsHaveErrors = editedConditions.length === 0 || conditionHasErrors

    const operatorOptions = operators.map(value => ({
      value,
      label: t(`deviceGroupsFlyout.options.${value}`)
    }));
    const typeOptions = valueTypes.map(value => ({
      value,
      label: t(`deviceGroupsFlyout.options.${value}`)
    }));

    return (
      <form onSubmit={this.apply} className='new-filter-form-container'>
        <Section.Container collapsable={false}>
          <Section.Header>
            {
              this.state.isEdit
                ? t('deviceGroupsFlyout.edit')
                : t('deviceGroupsFlyout.new')
            }
          </Section.Header>
          <Section.Content>
            <FormGroup>
              <FormLabel isRequired="true">
                {t('deviceGroupsFlyout.name')}
              </FormLabel>
              <FormControl
                type="text"
                className="long"
                placeholder={t('deviceGroupsFlyout.namePlaceHolder')}
                link={this.nameLink} />
            </FormGroup>
            <Btn className="add-btn" svg={svgs.plus} onClick={this.addCondition}>
              {t(`rulesFlyout.addCondition`)}
            </Btn>
            {
              conditionLinks.map((condition, idx) => (
                <Section.Container
                  key={this.state.conditions[idx].key}
                  <Section.Header>
                    {t('deviceGroupsFlyout.conditions.condition', { headerCount: idx + 1 })}
                    {
                      conditionLinks.length > 1 &&
                      <Btn svg={svgs.trash} onClick={this.deleteCondition(idx)}>
                        {t('deviceGroupsFlyout.conditions.delete')}
                      </Btn>
                    }
                  </Section.Header>
                  <Section.Content>
                    <FormGroup>
                      <FormLabel isRequired="true">
                        {t('deviceGroupsFlyout.conditions.field')}
                      </FormLabel>
                      <FormControl
                        type="select"
                        className="long"
                        clearable={false}
                        placeholder={t('deviceGroupsFlyout.conditions.field')}
                        link={condition.field} />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel isRequired="true">
                        {t('deviceGroupsFlyout.conditions.operator')}
                      </FormLabel>
                      <FormControl
                        type="select"
                        className="long"
                        clearable={false}
                        options={operatorOptions}
                        placeholder={t('deviceGroupsFlyout.conditions.operatorPlaceholder')}
                        link={condition.operator} />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel isRequired="true">
                        {t('deviceGroupsFlyout.conditions.value')}
                      </FormLabel>
                      <FormControl
                        type="text"
                        placeholder={t('deviceGroupsFlyout.conditions.valuePlaceholder')}
                        link={condition.value} />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel isRequired="true">
                        {t('deviceGroupsFlyout.conditions.type')}
                      </FormLabel>
                      <FormControl
                        type="select"
                        className="short"
                        clearable={false}
                        options={typeOptions}
                        placeholder={t('deviceGroupsFlyout.conditions.typePlaceholder')}
                        link={condition.type} />
                    </FormGroup>
                  </Section.Content>
                </Section.Container>
              ))
            }
            <BtnToolbar>
              <Btn
                primary
                disabled={!this.formIsValid() || conditionsHaveErrors}
                type="submit">
                {t('deviceGroupsFlyout.save')}
              </Btn>
              <Btn svg={svgs.cancelX} onClick={this.props.cancel}>{t('deviceGroupsFlyout.cancel')}</Btn>
            </BtnToolbar>
          </Section.Content>
        </Section.Container>
      </form>
    );
  }
}

export default DeviceGroupForm;
