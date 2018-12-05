// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Observable } from 'rxjs';

import {
  AjaxError,
  Btn,
  BtnToolbar,
  Protected,
  ToggleBtn
} from 'components/shared';
import { svgs } from 'utilities';
import { TelemetryService } from 'services';
import { permissions, toEditRuleRequestModel } from 'services/models';
import Flyout from 'components/shared/flyout';

import './ruleStatus.scss';
import { RuleSummary } from './ruleSummary';

export class RuleStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPending: false,
      error: undefined,
      changesApplied: undefined
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

  onToggle = ({ target: { value } }) => {
    if (this.state.changesApplied) {
      this.setState({ status: value, changesApplied: false });
    } else {
      this.setState({ status: value });
    }
  }

  changeRuleStatus = (event) => {
    event.preventDefault();
    const { rules, status } = this.state;
    this.setState({ isPending: true, error: null });
    const requestPropList = rules.map((rule) => ({
      ...rule,
      enabled: status
    }));
    this.subscription = Observable.from(requestPropList)
      .flatMap((rule) =>
        TelemetryService.updateRule(rule.id, toEditRuleRequestModel(rule))
          .map(updatedRule => ({...rule, eTag: updatedRule.eTag}))
      )
      .subscribe(
        updatedRule => {
          this.props.modifyRules([updatedRule]);
          this.setState({ isPending: false, changesApplied: true });
        },
        error => this.setState({ error, isPending: false, changesApplied: true })
      );
  }

  render() {
    const { onClose, t, rules } = this.props;
    const { isPending, status, error, changesApplied } = this.state;

    const completedSuccessfully = changesApplied && !error;

    return (
      <Flyout.Container>
        <Flyout.Header>
          <Flyout.Title>{t('rules.flyouts.statusTitle')}</Flyout.Title>
          <Flyout.CloseBtn onClick={onClose} />
        </Flyout.Header>
        <Flyout.Content>
          <Protected permission={permissions.updateRules}>
            <form onSubmit={this.changeRuleStatus} className="disable-rule-flyout-container">
              <div className="padded-top-bottom">
                <ToggleBtn
                  value={status}
                  onChange={this.onToggle} >
                  {status ? t('rules.flyouts.enable') : t('rules.flyouts.disable')}
                </ToggleBtn>
              </div>
              {
                rules.map((rule, idx) => (
                  <RuleSummary key={idx} rule={rule} isPending={isPending} completedSuccessfully={completedSuccessfully} t={t} />
                ))
              }

              {error && <AjaxError className="rule-status-error" t={t} error={error} />}
              {
                <BtnToolbar>
                  <Btn primary={true} disabled={!!changesApplied || isPending} type="submit">{t('rules.flyouts.ruleEditor.apply')}</Btn>
                  <Btn svg={svgs.cancelX} onClick={onClose}>{t('rules.flyouts.ruleEditor.cancel')}</Btn>
                </BtnToolbar>
              }
            </form>
          </Protected>
        </Flyout.Content>
      </Flyout.Container>
    );
  }
}
