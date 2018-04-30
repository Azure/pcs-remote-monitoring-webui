// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Observable } from 'rxjs';

import {
  Btn,
  FormLabel,
  ToggleBtn,
  BtnToolbar,
  SectionDesc,
  SummaryCount,
  SummarySection,
  AjaxError,
  Indicator
} from 'components/shared';
import { svgs } from 'utilities';
import { TelemetryService } from 'services';
import { toNewRuleRequestModel } from 'services/models';
import Flyout from 'components/shared/flyout';

import './ruleStatus.css';

export class RuleStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPending: false,
      error: undefined,
    };
  }

  componentDidMount() {
    const { rules } = this.props;
    this.setState({ rules, status: rules.length === 1 ? !rules[0].enabled : false });
  }

  componentWillReceiveProps(nextProps) {
    const { rules } = nextProps;
    this.setState({ rules, status: rules.length === 1 ? !rules[0].enabled : false });
  }

  componentWillUnmount() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onToggle = ({ target: { value } }) => this.setState({ status: value })

  changeRuleStatus = (event) => {
    event.preventDefault();
    const { rules, status } = this.state;
    this.setState({ isPending: true });
    const requestPropList = rules.map((rule) => ({
      ...rule,
      enabled: status
    }));
    this.subscription = Observable.from(requestPropList)
      .flatMap((rule) =>
        TelemetryService.updateRule(rule.id, toNewRuleRequestModel(rule))
          .map(() => rule)
      )
      .subscribe(
        updatedRule => { this.props.updateRule(updatedRule); },
        error => this.setState({ error, isPending: false }),
        () => this.props.onClose()
      );
  }

  render() {
    const { onClose, t, rules } = this.props;
    const { isPending, status, error } = this.state;
    return (
      <Flyout.Container>
        <Flyout.Header>
          <Flyout.Title>{t('rules.flyouts.statusTitle')}</Flyout.Title>
          <Flyout.CloseBtn onClick={onClose} />
        </Flyout.Header>
        <Flyout.Content>
          <form onSubmit={this.changeRuleStatus} className="disable-rule-flyout-container">
            <div className="padded-top-bottom">
              <ToggleBtn
                value={status}
                onChange={this.onToggle} >
                {status ? t('rules.flyouts.enable') : t('rules.flyouts.disable')}
              </ToggleBtn>
            </div>
            {
              rules.map((rule) => (
                <SummarySection key={rule.id} title={rule.name} className="padded-bottom">
                  <FormLabel className="rule-description">{rule.description}</FormLabel>
                  <SummaryCount>{rule.count.response ? rule.count.response : '---'}</SummaryCount>
                  <SectionDesc>{t('rules.flyouts.ruleEditor.devicesAffected')}</SectionDesc>
                </SummarySection>
              ))
            }
            <SummarySection>
              {
                error && <AjaxError t={t} error={error} />
              }
              {
                isPending && <Indicator size="large" pattern="bar" />
              }
              {
                !isPending && <BtnToolbar>
                  <Btn svg={svgs.apply} primary={true} type="submit">{t('rules.flyouts.ruleEditor.apply')}</Btn>
                  <Btn svg={svgs.cancelX} onClick={onClose}>{t('rules.flyouts.ruleEditor.cancel')}</Btn>
                </BtnToolbar>
              }
            </SummarySection>
          </form>
        </Flyout.Content>
      </Flyout.Container>
    );
  }
}
