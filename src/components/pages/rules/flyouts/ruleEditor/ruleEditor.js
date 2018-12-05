// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Trans } from 'react-i18next';
import update from 'immutability-helper';

import Config from 'app.config';
import {
  AjaxError,
  Btn,
  BtnToolbar,
  FormControl,
  FormGroup,
  FormLabel,
  Hyperlink,
  Indicator,
  PillGroup,
  Radio,
  SectionDesc,
  SectionHeader,
  SummaryBody,
  SummaryCount,
  SummarySection,
  Svg,
  ThemedSvgContainer,
  ToggleBtn,
  Tooltip
} from 'components/shared';
import { ActionEmailSetupContainer } from './actionEmailSetup.container';
import { SeverityRenderer } from 'components/shared/cellRenderers';
import {
  Validator,
  svgs,
  isValidEmail,
  LinkedComponent,
  themedPaths
} from 'utilities';
import Flyout from 'components/shared/flyout';
import { IoTHubManagerService, TelemetryService } from 'services';
import {
  toEditRuleRequestModel,
  ruleCalculations,
  ruleTimePeriods,
  ruleOperators,
  toRuleDiagnosticsModel,
  toDiagnosticsModel,
  toSinglePropertyDiagnosticsModel
} from 'services/models';


import './ruleEditor.scss';

const Section = Flyout.Section;

// A counter for creating unique keys per new condition
let conditionKey = 0;

// A counter for creating unique keys per new action
let actionKey = 0;

// Creates a state object for a condition
const newCondition = () => ({
  field: undefined,
  operator: undefined,
  value: undefined,
  key: conditionKey++ // Used by react to track the rendered elements
});

const newAction = () => ({
  type: 'Email',
  parameters: {
    recipients: [],
    notes: '',
    subject: ''
  },
  key: actionKey++
})

// A state object for a new rule
const newRule = {
  name: '',
  description: '',
  groupId: '',
  calculation: '',
  timePeriod: '',
  conditions: [newCondition()], // Start with one condition
  actions: [newAction()], // Start with one action
  severity: Config.ruleSeverity.critical,
  enabled: true,
  actionEnabled: false
}

export class RuleEditor extends LinkedComponent {

  constructor(props) {
    super(props);

    this.state = {
      error: undefined,
      fieldOptions: [],
      fieldQueryPending: true,
      devicesAffected: 0,
      formData: newRule,
      newEmail: '',
      isPending: false,
      changesApplied: undefined
    };

    this.newEmailLink = this.linkTo('newEmail') // Matches email address pattern
      .check(val => isValidEmail(val), () => this.props.t('rules.flyouts.ruleEditor.actions.syntaxError'));
  }

  componentDidMount() {
    const { rule } = this.props;
    if (rule) {
      this.getDeviceCountAndFields(rule.groupId);
      this.setFormState(rule);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { rule } = nextProps;
    if (rule) this.setFormState(rule);
  }

  setFormState = (rule) => this.setState({
    formData: {
      ...rule,
      conditions: (rule.conditions || []).map(condition => ({
        ...condition,
        key: conditionKey++
      })),
      actions:
        !rule.actions || rule.actions.length === 0
          ? [newAction()]
          : rule.actions.map(action => ({ ...action, key: actionKey++ })
          ),
      actionEnabled: rule.actions === undefined ? false : (rule.actions || []).length > 0 ? true : false
    }
  });

  componentWillUnmount() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  toSelectOption = ({ id, displayName }) => ({ label: displayName, value: id });

  addCondition = () => {
    this.conditionsLink.set([...this.conditionsLink.value, newCondition()]);
    this.props.logEvent(toDiagnosticsModel('Rule_AddConditionClick', {}));
  }

  deleteCondition = (index) =>
    (evt) => this.conditionsLink.set(this.conditionsLink.value.filter((_, idx) => index !== idx));

  formIsValid() {
    return [
      this.ruleNameLink,
      this.deviceGroupLink,
      this.conditionsLink,
      this.actionsLink,
      this.timePeriodLink,
      this.calculationLink
    ].every(link => !link.error);
  }

  apply = (event) => {
    event.preventDefault();
    const { insertRules, modifyRules, logEvent, t } = this.props;
    const requestProps = { ...this.state.formData };
    const { devicesAffected, newEmail } = this.state;
    if (requestProps.calculation === ruleCalculations[1]) requestProps.timePeriod = '';
    if (this.state.formData.actionEnabled === false) requestProps.actions = [];
    if (this.formIsValid()) {
      this.setState({ isPending: true, error: null });
      if (this.subscription) this.subscription.unsubscribe();
      const countProps = {
        count: {
          response: devicesAffected,
          error: undefined
        },
        lastTrigger: {
          response: undefined,
          erroe: undefined
        }
      };

      if (this.state.formData.actionEnabled) {
        const action = requestProps.actions[0];
        if (newEmail !== '') {
          action.parameters.recipients.push(newEmail);
          this.setState({ newEmail: '' });
        }

        if (action.parameters.subject === '') {
          const ruleName = requestProps.name
          action.parameters.subject = t('rules.flyouts.ruleEditor.actions.defaultEmailSubject', { ruleName });
        }
      }

      logEvent(toRuleDiagnosticsModel('Rule_ApplyClick', requestProps));
      if (this.props.rule) { // If rule object exist then update the existing rule
        this.subscription = TelemetryService.updateRule(this.props.rule.id, toEditRuleRequestModel(requestProps))
          .subscribe(
            (updatedRule) => {
              modifyRules([{ ...updatedRule, ...countProps }]);
              this.setState({ isPending: false, changesApplied: true });
            },
            error => this.setState({ error, isPending: false, changesApplied: true })
          );
      } else { // If rule object doesn't exist then create a new rule
        this.subscription = TelemetryService.createRule(toEditRuleRequestModel(requestProps))
          .subscribe(
            (createdRule) => {
              insertRules([{ ...createdRule, ...countProps }]);
              this.setState({ isPending: false, changesApplied: true });
            },
            error => this.setState({ error, isPending: false, changesApplied: true })
          );
      }
    }
  }

  onGroupIdChange = ({ target: { value: { value = {} } } }) => {
    const { logEvent } = this.props;
    this.setState({
      fieldQueryPending: true,
      isPending: true
    });
    logEvent(toSinglePropertyDiagnosticsModel('Rule_DeviceGroupClick', 'DeviceGroup', value));
    this.getDeviceCountAndFields(value);
    this.formControlChange();
  }

  onAddEmail = (link) => (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!this.newEmailLink.error && this.newEmailLink.value !== '') {
        const newState = update(
          this.state,
          {
            // Saves user entered email value into action object's list of emails
            ...link.setter({ $set: [...link.value, this.newEmailLink.value] }),
            // Clears new email input textfield of user's entered email value
            ...this.newEmailLink.setter({ $set: '' })
          }
        );
        this.setState(newState);
      }
    }
    this.formControlChange();
  }

  deleteEmail = (index) => (link) =>
    (e) => link.set(link.value.filter((_, idx) => index !== idx));

  getDeviceCountAndFields(groupId) {
    this.props.deviceGroups.some(group => {
      if (group.id === groupId) {
        if (this.subscription) this.subscription.unsubscribe();
        this.subscription = IoTHubManagerService.getDevices(group.conditions)
          .subscribe(
            groupDevices => {
              this.setState({
                fieldQueryPending: false,
                fieldOptions: this.getConditionFields(groupDevices),
                devicesAffected: groupDevices.length,
                isPending: false
              });
            },
            error => this.setState({ error })
          );
        return true;
      }
      return false;
    });
  }

  getConditionFields(devices) {
    const conditions = new Set(); // Using a set to avoid searching the array multiple times in the every
    devices.forEach(({ telemetry = {} }) => {
      Object.values(telemetry).forEach(({ messageSchema: { fields } }) => {
        Object.keys(fields).forEach((field) => {
          if (field.toLowerCase().indexOf('unit') === -1) conditions.add(field);
        })
      })
    })
    return [...conditions.values()].map(field => ({ label: field, value: field }));
  }

  //todo toggle button didn't support link
  onStatusToggle = ({ target: { value } }) => {
    this.setState({ formData: { ...this.state.formData, enabled: value } });
    this.props.logEvent(toSinglePropertyDiagnosticsModel('Rule_StatusToggle', 'RuleStatus', value ? 'Enabled' : 'Disabled'));
    this.formControlChange();
  }

  onCalculationChange = ({ target: { value: { value = {} } } }) => {
    this.props.logEvent(toSinglePropertyDiagnosticsModel('Rule_CalculationClick', 'Calculation', value));
    this.formControlChange();
  }

  onFieldChange = (index, { target: { value: { value = {} } } }) => {
    var eventProperties = { 'FieldChosen': value, 'ConditionNumber': index };
    this.props.logEvent(toDiagnosticsModel('Rule_FieldClick', eventProperties));
    this.formControlChange();
  }

  onOperatorChange = (index, { target: { value: { value = {} } } }) => {
    var eventProperties = { 'OperatorChosen': value, 'ConditionNumber': index };
    this.props.logEvent(toDiagnosticsModel('Rule_OperatorClick', eventProperties));
    this.formControlChange();
  }

  onSeverityChange = ({ target: { value } }) => {
    this.props.logEvent(toSinglePropertyDiagnosticsModel('Rule_SeverityLevelClick', 'SeverityLevel', value))
    this.formControlChange();
  }

  onCloseClick = () => {
    const { onClose, logEvent } = this.props;
    const rule = { ...this.state.formData };
    logEvent(toRuleDiagnosticsModel('Rule_CancelClick', rule));
    onClose();
  }

  formControlChange = () => {
    if (this.state.changesApplied) {
      this.setState({ changesApplied: false });
    }
  }

  deletePill = link => index => () => {
    link.set(link.value.filter((_, idx) => index !== idx));
    this.formControlChange();
  }

  onActionToggle = ({ target: { value } }) => {
    this.setState({ formData: { ...this.state.formData, actionEnabled: value } });
    this.props.logEvent(toSinglePropertyDiagnosticsModel('Rule_ActionToggle', 'EmailActionStatus', value ? 'Enabled' : 'Disabled'));
    this.formControlChange();
  }

  render() {
    const { t, deviceGroups = [] } = this.props;
    const {
      changesApplied,
      devicesAffected,
      error,
      fieldOptions,
      fieldQueryPending,
      formData,
      isPending
    } = this.state;
    const calculationOptions = ruleCalculations.map(value => ({
      label: t(`rules.flyouts.ruleEditor.calculationOptions.${value.toLowerCase()}`),
      value
    }));
    const deviceGroupOptions = deviceGroups.map(this.toSelectOption);
    // Validators
    const requiredValidator = (new Validator()).check(Validator.notEmpty, t('rules.flyouts.ruleEditor.validation.required'));
    // State links
    this.formDataLink = this.linkTo('formData');
    this.ruleNameLink = this.formDataLink.forkTo('name').withValidator(requiredValidator);
    this.descriptionLink = this.formDataLink.forkTo('description');
    this.deviceGroupLink = this.formDataLink.forkTo('groupId')
      .map(({ value }) => value)
      .withValidator(requiredValidator);
    this.calculationLink = this.formDataLink.forkTo('calculation').map(({ value }) => value).withValidator(requiredValidator);
    this.timePeriodLink = this.formDataLink.forkTo('timePeriod')
      .map(({ value }) => value)
      .check(
        timePeriod => this.calculationLink.value === ruleCalculations[0] ? Validator.notEmpty(timePeriod) : true,
        this.props.t('rules.flyouts.ruleEditor.validation.required')
      );
    this.conditionsLink = this.formDataLink.forkTo('conditions').withValidator(requiredValidator);
    this.actionsLink = this.formDataLink.forkTo('actions').withValidator(requiredValidator);
    this.severityLink = this.formDataLink.forkTo('severity');
    //todo toggle button didn't support link
    this.enabledLink = this.formDataLink.forkTo('enabled');
    // Create the state link for the dynamic form elements
    const conditionLinks = this.conditionsLink.getLinkedChildren(conditionLink => {
      const fieldLink = conditionLink.forkTo('field').map(({ value }) => value).withValidator(requiredValidator);
      const operatorLink = conditionLink.forkTo('operator').map(({ value }) => value).withValidator(requiredValidator);
      const valueLink = conditionLink.forkTo('value')
        .check(Validator.notEmpty, () => this.props.t('rules.flyouts.ruleEditor.validation.required'))
        .check(val => !isNaN(val), t('rules.flyouts.ruleEditor.validation.nan'));
      const error = fieldLink.error || operatorLink.error || valueLink.error;
      return { fieldLink, operatorLink, valueLink, error };
    });

    const actionLinks = this.actionsLink.getLinkedChildren(actionLink => {
      const parametersLink = actionLink.forkTo('parameters');
      // recipients is valid if email input box is empty and at least one email has been
      // entered, or if email input box has a valid email
      const recipientsLink = parametersLink.forkTo('recipients')
        .check(val => ((this.state.newEmail !== '' && isValidEmail(this.state.newEmail))
          || (val.length > 0 && (isValidEmail(this.state.newEmail)))),
          this.props.t('rules.flyouts.ruleEditor.validation.required'));
      const notesLink = parametersLink.forkTo('notes');
      const subjectLink = parametersLink.forkTo('subject');
      const error = formData.actionEnabled ? (recipientsLink.error) : false;
      return { recipientsLink, notesLink, subjectLink, error };
    });

    const conditionsHaveErrors = conditionLinks.some(({ error }) => error);
    const actionsHaveErrors = actionLinks.some(({ error }) => error);
    const completedSuccessfully = changesApplied && !error;

    const operatorOptions = ruleOperators.map(value => ({
      label: t(`rules.flyouts.ruleEditor.condition.operatorOptions.${value}`),
      value
    }));

    return (
      <form onSubmit={this.apply} className="new-rule-flyout-container">
        <Section.Container className="rule-property-container">
          <Section.Content>
            <FormGroup>
              <FormLabel isRequired="true">{t('rules.flyouts.ruleEditor.ruleName')}</FormLabel>
              <FormControl
                type="text"
                className="long"
                placeholder={t('rules.flyouts.ruleEditor.namePlaceholder')}
                onChange={this.formControlChange}
                link={this.ruleNameLink} />
            </FormGroup>
            <FormGroup>
              <FormLabel>{t('rules.flyouts.ruleEditor.description')}</FormLabel>
              <FormControl
                type="textarea"
                placeholder={t('rules.flyouts.ruleEditor.descriptionPlaceholder')}
                onChange={this.formControlChange}
                link={this.descriptionLink} />
            </FormGroup>
            <FormGroup>
              <FormLabel isRequired="true">{t('rules.flyouts.ruleEditor.deviceGroup')}</FormLabel>
              <FormControl
                type="select"
                className="long"
                options={deviceGroupOptions}
                onChange={this.onGroupIdChange}
                clearable={false}
                searchable={true}
                placeholder={t('rules.flyouts.ruleEditor.deviceGroupPlaceholder')}
                link={this.deviceGroupLink} />
            </FormGroup>
            <FormGroup>
              <FormLabel isRequired="true">{t('rules.flyouts.ruleEditor.calculation')}</FormLabel>
              <FormControl
                type="select"
                className="long"
                placeholder={t('rules.flyouts.ruleEditor.calculationPlaceholder')}
                link={this.calculationLink}
                options={calculationOptions}
                onChange={this.onCalculationChange}
                clearable={false}
                searchable={false} />
            </FormGroup>
            {
              this.calculationLink.value === ruleCalculations[0] &&
              <FormGroup>
                <FormLabel isRequired="true">{t('rules.flyouts.ruleEditor.timePeriod')}</FormLabel>
                <FormControl
                  type="select"
                  className="short"
                  onChange={this.formControlChange}
                  link={this.timePeriodLink}
                  options={ruleTimePeriods}
                  clearable={false}
                  searchable={false} />
              </FormGroup>
            }
          </Section.Content>
        </Section.Container>
        {
          !fieldQueryPending && <div>
            {
              conditionLinks.map((condition, idx) => (
                <Section.Container key={formData.conditions[idx].key}>
                  <Section.Header>{t('rules.flyouts.ruleEditor.condition.condition')} {idx + 1}</Section.Header>
                  <Section.Content>
                    <FormGroup>
                      <FormLabel isRequired="true">{t('rules.flyouts.ruleEditor.condition.field')}</FormLabel>
                      <FormControl
                        type="select"
                        className="long"
                        placeholder={t('rules.flyouts.ruleEditor.condition.fieldPlaceholder')}
                        onChange={(target) => this.onFieldChange(idx + 1, target)}
                        link={condition.fieldLink}
                        options={fieldOptions}
                        clearable={false}
                        searchable={true} />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel isRequired="true">{t('rules.flyouts.ruleEditor.condition.operator')}</FormLabel>
                      <FormControl
                        type="select"
                        className="long"
                        placeholder={t('rules.flyouts.ruleEditor.condition.operatorPlaceholder')}
                        onChange={(target) => this.onOperatorChange(idx + 1, target)}
                        link={condition.operatorLink}
                        options={operatorOptions}
                        clearable={false}
                        searchable={false} />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel isRequired="true">{t('rules.flyouts.ruleEditor.condition.value')}</FormLabel>
                      <FormControl
                        type="text"
                        placeholder={t('rules.flyouts.ruleEditor.condition.valuePlaceholder')}
                        onChange={this.formControlChange}
                        link={condition.valueLink} />
                    </FormGroup>
                    {
                      conditionLinks.length > 1 &&
                      <Btn className="padded-top" svg={svgs.trash} onClick={this.deleteCondition(idx)}>{t('rules.flyouts.ruleEditor.delete')}</Btn>
                    }
                  </Section.Content>
                </Section.Container>
              ))
            }
            <Section.Container collapsable={false}>
              <Section.Header>{t('rules.flyouts.ruleEditor.conditions')}</Section.Header>
              <Section.Content>
                <Btn svg={svgs.plus} onClick={this.addCondition}>{t('rules.flyouts.ruleEditor.addCondition')}</Btn>
              </Section.Content>
            </Section.Container>
            <Section.Container collapsable={false}>
              <Section.Header>{t('rules.flyouts.ruleEditor.severityLevel')}</Section.Header>
              <Section.Content>
                <FormGroup>
                  <Radio
                    onChange={this.onSeverityChange}
                    link={this.severityLink}
                    value={Config.ruleSeverity.critical}>
                    <FormLabel>
                      <SeverityRenderer value={Config.ruleSeverity.critical} context={{ t }} />
                    </FormLabel>
                  </Radio>
                  <Radio
                    onChange={this.onSeverityChange}
                    link={this.severityLink}
                    value={Config.ruleSeverity.warning}>
                    <FormLabel>
                      <SeverityRenderer value={Config.ruleSeverity.warning} context={{ t }} />
                    </FormLabel>
                  </Radio>
                  <Radio
                    onChange={this.onSeverityChange}
                    link={this.severityLink}
                    value={Config.ruleSeverity.info}>
                    <FormLabel>
                      <SeverityRenderer value={Config.ruleSeverity.info} context={{ t }} />
                    </FormLabel>
                  </Radio>
                </FormGroup>
              </Section.Content>
              <Section.Container collapsable={false}>
                <Section.Header>{t('rules.flyouts.ruleEditor.actions.action')}</Section.Header>
                <div className="email-toggle-container">
                  <ToggleBtn
                    value={formData.actionEnabled}
                    onChange={this.onActionToggle} >
                    {formData.actionEnabled ? t('rules.flyouts.ruleEditor.actions.on') : t('rules.flyouts.ruleEditor.actions.off')}
                  </ToggleBtn>
                  <Tooltip content={
                    <Trans i18nKey={`rules.flyouts.ruleEditor.actions.emailSetupHelp`}>
                      Manual setup is required.
                      <Hyperlink href={Config.contextHelpUrls.ruleActionsEmail} target="_blank">{t('rules.flyouts.ruleEditor.actions.learnMore')}</Hyperlink>
                    </Trans>
                  }>
                    <ThemedSvgContainer paths={themedPaths.questionBubble} />
                  </Tooltip>
                </div>
                {
                  formData.actionEnabled &&
                  <ActionEmailSetupContainer />
                }
                <Section.Content>
                  {
                    formData.actionEnabled && actionLinks.map((action, idx) => (
                      <Section.Content key={formData.actions[idx].key}>
                        <p className="padded-top">{t('rules.flyouts.ruleEditor.actions.emailAddresses')}</p>
                        <FormGroup>
                          <FormControl
                            type="text"
                            className="long"
                            onKeyPress={this.onAddEmail(action.recipientsLink)}
                            link={this.newEmailLink}
                            placeholder={t('rules.flyouts.ruleEditor.actions.enterEmail')} />
                        </FormGroup>
                        <PillGroup
                          pills={action.recipientsLink.value}
                          svg={svgs.cancelX}
                          onSvgClick={this.deletePill(action.recipientsLink)}
                          altSvgText={t('rules.flyouts.ruleEditor.actions.deleteEmail')} />
                        <p className="padded-top">{t('rules.flyouts.ruleEditor.actions.emailSubject')}</p>
                        <FormGroup>
                          <FormControl
                            type="textarea"
                            link={action.subjectLink}
                            placeholder={t('rules.flyouts.ruleEditor.actions.enterEmailSubject')}
                            onChange={this.formControlChange} />
                        </FormGroup>
                        <p className="padded-top">{t('rules.flyouts.ruleEditor.actions.emailComments')}</p>
                        <FormGroup>
                          <FormControl
                            type="textarea"
                            link={action.notesLink}
                            placeholder={t('rules.flyouts.ruleEditor.actions.enterEmailComments')}
                            onChange={this.formControlChange} />
                        </FormGroup>
                      </Section.Content>
                    ))
                  }
                </Section.Content>
              </Section.Container>
              <Section.Container>
                <Section.Header>{t('rules.flyouts.ruleEditor.ruleStatus')}</Section.Header>
                <Section.Content>
                  <FormGroup>
                    <ToggleBtn
                      value={formData.enabled}
                      onChange={this.onStatusToggle} >
                      {formData.enabled ? t('rules.flyouts.ruleEditor.ruleEnabled') : t('rules.flyouts.ruleEditor.ruleDisabled')}
                    </ToggleBtn>
                  </FormGroup>
                </Section.Content>
              </Section.Container>
            </Section.Container>
          </div>
        }

        <SummarySection>
          <SectionHeader>{t('rules.flyouts.ruleEditor.summaryHeader')}</SectionHeader>
          <SummaryBody>
            <SummaryCount>{devicesAffected}</SummaryCount>
            <SectionDesc>{t('rules.flyouts.ruleEditor.devicesAffected')}</SectionDesc>
            {isPending && <Indicator />}
            {completedSuccessfully && <Svg className="summary-icon" path={svgs.apply} />}
          </SummaryBody>
        </SummarySection>

        {error && <AjaxError className="rule-editor-error" t={t} error={error} />}
        {
          <BtnToolbar>
            <Btn primary={true}
              disabled={!!changesApplied || isPending || !this.formIsValid() || conditionsHaveErrors || actionsHaveErrors}
              type="submit">
              {t('rules.flyouts.ruleEditor.apply')}
            </Btn>
            <Btn svg={svgs.cancelX} onClick={this.onCloseClick}>{t('rules.flyouts.ruleEditor.cancel')}</Btn>
          </BtnToolbar>
        }
      </form>
    );
  }
}
