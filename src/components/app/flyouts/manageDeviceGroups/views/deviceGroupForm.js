// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { svgs, LinkedComponent, Validator } from 'utilities';
import {
  AjaxError,
  Btn,
  BtnToolbar,
  FormControl,
  FormGroup,
  FormLabel,
  Indicator
} from 'components/shared';
import { ConfigService } from 'services';
import {
  toCreateDeviceGroupRequestModel,
  toUpdateDeviceGroupRequestModel
} from 'services/models';

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
      id: undefined,
      eTag: undefined,
      displayName: '',
      conditions: [newCondition()],
      isPending: false,
      error: undefined,
      isEdit: !!this.props.selectedDeviceGroup
    };

    // State to input links
    this.nameLink = this.linkTo('displayName')
      .check(Validator.notEmpty, () => this.props.t('deviceGroupsFlyout.errorMsg.nameCantBeEmpty'));

    this.conditionsLink = this.linkTo('conditions');
    this.subscriptions = [];
  }

  formIsValid() {
    return [
      this.nameLink,
      this.conditionsLink
    ].every(link => !link.error);
  }

  componentDidMount() {
    if (this.state.isEdit) this.computeState(this.props);
  }

  componentWillUnmount() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  computeState = ({
    selectedDeviceGroup: {
      id, eTag, conditions, displayName
    }
  }) => {
    if (this.state.isEdit) {
      this.setState({
        id,
        eTag,
        displayName,
        conditions: conditions.map(condition => ({
          field: condition.key,
          operator: condition.operator,
          type: isNaN(condition.value) ? 'Text' : 'Number',
          value: condition.value,
          key: conditionKey++
        }))
      });
    }
  }

  toSelectOption = ({ id, name }) => ({ value: id, label: name });

  selectServiceCall = () => {
    if (this.state.isEdit) {
      return ConfigService.updateDeviceGroup(this.state.id, toUpdateDeviceGroupRequestModel(this.state));
    }
    return ConfigService.createDeviceGroup(toCreateDeviceGroupRequestModel(this.state));
  };

  apply = (event) => {
    event.preventDefault();
    this.setState({ error: undefined, isPending: true });
    this.subscriptions.push(
      this.selectServiceCall()
        .subscribe(
          deviceGroup => {
            this.props.insertDeviceGroup(deviceGroup);
            this.props.cancel();
          },
          error => this.setState({ error, isPending: false }),
        )
    );
  };

  addCondition = () => this.conditionsLink.set([
    ...this.conditionsLink.value,
    newCondition()
  ]);

  deleteCondition = (index) =>
    () => this.conditionsLink.set(this.conditionsLink.value.filter((_, idx) => index !== idx));

  deleteDeviceGroup = () => {
    this.setState({ error: undefined, isPending: true });
    ConfigService.deleteDeviceGroup(this.state.id)
      .subscribe(
        deletedGroupId => {
          this.props.deleteDeviceGroup(deletedGroupId);
          this.props.cancel();
        },
        error => this.setState({ error, isPending: false }),
      );
  };

  render () {
    const { t } = this.props;
    // Create the state link for the dynamic form elements
    const conditionLinks = this.conditionsLink.getLinkedChildren(conditionLink => {
      const field = conditionLink.forkTo('field')
        .map(({ value }) => value)
        .check(Validator.notEmpty, t('deviceGroupsFlyout.errorMsg.fieldCantBeEmpty'));
      const operator = conditionLink.forkTo('operator')
        .map(({ value }) => value)
        .check(Validator.notEmpty, t('deviceGroupsFlyout.errorMsg.operatorCantBeEmpty'));
      const type = conditionLink.forkTo('type')
      .map(({ value }) => value)
        .check(Validator.notEmpty, t('deviceGroupsFlyout.errorMsg.typeCantBeEmpty'));
      const value = conditionLink.forkTo('value')
        .check(Validator.notEmpty, t('deviceGroupsFlyout.errorMsg.valueCantBeEmpty'))
        .check(val => type.value === 'Number' ? !isNaN(val): true, 'Must be of the selected type');
      const edited = !(!field.value && !operator.value && !value.value && !type.value);
      const error = (edited && (field.error || operator.error || value.error || type.error)) || '';
      return { field, operator, value, type, edited, error };
    });

    const editedConditions = conditionLinks.filter(({ edited }) => edited);
    const conditionHasErrors = editedConditions.some(({ error }) => !!error);
    const conditionsHaveErrors = conditionHasErrors

    const operatorOptions = operators.map(value => ({
      label: t(`deviceGroupsFlyout.options.${value}`),
      value
    }));
    const typeOptions = valueTypes.map(value => ({
      label: t(`deviceGroupsFlyout.options.${value}`),
      value
    }));

    return (
      <form onSubmit={this.apply}>
        <Section.Container collapsable={false} className="borderless">
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
                <Section.Container key={this.state.conditions[idx].key}>
                  <Section.Header>
                    {t('deviceGroupsFlyout.conditions.condition', { headerCount: idx + 1 })}
                  </Section.Header>
                  <Section.Content>
                    <FormGroup>
                      <FormLabel isRequired="true">
                        {t('deviceGroupsFlyout.conditions.field')}
                      </FormLabel>
                      {
                        this.props.filtersError
                          ? <AjaxError t={t} error={this.props.filtersError} />
                          : <FormControl
                              type="select"
                              className="long"
                              searchable={false}
                              clearable={false}
                              placeholder={t('deviceGroupsFlyout.conditions.field')}
                              options={this.props.filterOptions}
                              link={condition.field} />
                      }
                    </FormGroup>
                    <FormGroup>
                      <FormLabel isRequired="true">
                        {t('deviceGroupsFlyout.conditions.operator')}
                      </FormLabel>
                      <FormControl
                        type="select"
                        className="long"
                        searchable={false}
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
                        searchable={false}
                        options={typeOptions}
                        placeholder={t('deviceGroupsFlyout.conditions.typePlaceholder')}
                        link={condition.type} />
                    </FormGroup>
                    <BtnToolbar>
                      <Btn onClick={this.deleteCondition(idx)}>{t('deviceGroupsFlyout.conditions.remove')}</Btn>
                    </BtnToolbar>
                  </Section.Content>
                </Section.Container>
              ))
            }
            { this.state.isPending && <Indicator pattern="bar" size="medium" />}
            <BtnToolbar>
              <Btn
                primary
                disabled={!this.formIsValid() || conditionsHaveErrors || this.state.isPending}
                type="submit">
                {t('deviceGroupsFlyout.save')}
              </Btn>
              <Btn svg={svgs.cancelX} onClick={this.props.cancel}>{t('deviceGroupsFlyout.cancel')}</Btn>
              {
                // Don't show delete btn if it is a new group or the group is currently active
                this.state.isEdit &&
                <Btn svg={svgs.trash}
                  onClick={this.deleteDeviceGroup}
                  disabled={this.props.activeDeviceGroupId === this.state.id || this.state.isPending}>
                  {t('deviceGroupsFlyout.conditions.delete')}
                </Btn>
              }
            </BtnToolbar>
            { this.state.error && <AjaxError t={t} error={this.state.error} /> }
          </Section.Content>
        </Section.Container>
      </form>
    );
  }
}

export default DeviceGroupForm;
