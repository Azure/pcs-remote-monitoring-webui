// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import {
  PropertyGrid as Grid,
  PropertyGridHeader as GridHeader,
  PropertyRow as Row,
  PropertyCell as Cell,
  SectionDesc,
  SectionHeader,
  SummaryBody,
  SummaryCount,
  SummarySection,
} from 'components/shared';
import { SeverityRenderer } from 'components/shared/cellRenderers';
import Flyout from 'components/shared/flyout';
import { IoTHubManagerService } from 'services';
import {
  ruleCalculations,
  getRuleTimePeriodLabel,
  getRuleOperatorLabel
} from 'services/models';

import './ruleViewer.css';

const Section = Flyout.Section;

export class RuleViewer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      devicesAffected: 0,
    };
  }

  componentDidMount() {
    const { rule } = this.props;
    if (rule) {
      this.getDeviceCount(rule.groupId);
    }
  }

  componentWillUnmount() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  getDeviceCount(groupId) {
    this.props.deviceGroups.some(group => {
      if (group.id === groupId) {
        if (this.subscription) this.subscription.unsubscribe();
        this.subscription = IoTHubManagerService.getDevices(group.conditions)
          .subscribe(
            groupDevices => {
              this.setState({
                devicesAffected: groupDevices.length
              });
            },
            error => this.setState({ error })
          );
        return true;
      }
      return false;
    });
  }

  getDeviceGroupName(groupId) {
    const deviceGroup = this.props.deviceGroups.find(group => group.id === groupId);
    return (deviceGroup || {}).displayName || groupId;
  }

  render() {
    const { rule, t } = this.props;
    const { devicesAffected } = this.state;

    const calculation = t(`rules.flyouts.ruleEditor.calculationOptions.${rule.calculation.toLowerCase()}`);

    return (
      <div className="view-rule-flyout-container">
        <Section.Container>
          <Section.Content>

            <div className="rule-name">{rule.name}</div>
            <div className="rule-prop-value">{rule.description}</div>

            <div className="rule-prop-label">{t('rules.flyouts.ruleEditor.deviceGroup')}</div>
            <div className="rule-prop-value">{this.getDeviceGroupName(rule.groupId)}</div>

            <div className="rule-prop-label">{t('rules.flyouts.ruleEditor.calculation')}</div>
            <div className="rule-prop-value">{calculation}</div>

            {
              calculation === ruleCalculations[0] &&
              <div>
                <div className="rule-prop-label">{t('rules.flyouts.ruleEditor.timePeriod')}</div>
                <div className="rule-prop-value">{getRuleTimePeriodLabel(rule.timePeriod)}</div>
              </div>
            }
          </Section.Content>
        </Section.Container>

        <Section.Container collapsable={false}>
          <Section.Header>{t('rules.flyouts.ruleEditor.conditions')}</Section.Header>
          <Section.Content>
            {
              (rule.conditions.length > 0) &&
              <Grid>
                <GridHeader>
                  <Row>
                    <Cell className="col-4">{t('rules.flyouts.ruleEditor.condition.field')}</Cell>
                    <Cell className="col-3">{t('rules.flyouts.ruleEditor.condition.operator')}</Cell>
                    <Cell className="col-3">{t('rules.flyouts.ruleEditor.condition.value')}</Cell>
                  </Row>
                </GridHeader>
                {
                  rule.conditions.map((condition, idx) =>
                    <Row key={idx}>
                      <Cell className="col-4">{condition.field}</Cell>
                      <Cell className="col-3">{getRuleOperatorLabel(condition.operator)}</Cell>
                      <Cell className="col-3">{condition.value}</Cell>
                    </Row>
                  )
                }
              </Grid>
            }
          </Section.Content>
        </Section.Container>

        {
          rule.actions && rule.actions.length > 0 &&
          <Section.Container collapsable={false}>
            <Section.Content>
              <div className="rule-action-title">{t('rules.flyouts.ruleEditor.actions.action')}</div>
              <div className="rule-prop-label">{t('rules.flyouts.ruleEditor.actions.emailAddresses')}</div>
              <div className="rule-prop-value">{rule.actions[0].parameters.recipients.join(", ")}</div>
              <div className="rule-prop-label">{t('rules.flyouts.ruleEditor.actions.emailSubject')}</div>
              <div className="rule-prop-value">{rule.actions[0].parameters.subject}</div>
              <div className="rule-prop-label">{t('rules.flyouts.ruleEditor.actions.emailComments')}</div>
              <div className="rule-prop-value">{rule.actions[0].parameters.notes}</div>
            </Section.Content>
          </Section.Container>
        }

        <Section.Container>
          <Section.Content>
            <div className="rule-prop-label">{t('rules.flyouts.ruleEditor.severityLevel')}</div>
            <div className="rule-prop-value"><SeverityRenderer value={rule.severity} context={{ t }} /></div>

            <div className="rule-prop-label">{t('rules.flyouts.ruleEditor.ruleStatus')}</div>
            <div className="rule-prop-value">{rule.enabled ? t('rules.flyouts.ruleEditor.ruleEnabled') : t('rules.flyouts.ruleEditor.ruleDisabled')}</div>
          </Section.Content>
        </Section.Container>

        <SummarySection>
          <SectionHeader>{t('rules.flyouts.ruleEditor.summaryHeader')}</SectionHeader>
          <SummaryBody>
            <SummaryCount>{devicesAffected}</SummaryCount>
            <SectionDesc>{t('rules.flyouts.ruleEditor.devicesAffected')}</SectionDesc>
          </SummaryBody>
        </SummarySection>
      </div>
    );
  }
}
