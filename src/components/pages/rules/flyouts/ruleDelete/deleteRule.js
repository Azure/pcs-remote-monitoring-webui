// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { permissions } from 'services/models';
import {
  AjaxError,
  Btn,
  BtnToolbar,
  Protected,
  Svg
} from 'components/shared';
import { svgs } from 'utilities';
import { TelemetryService } from 'services';
import { toEditRuleRequestModel } from 'services/models';
import Flyout from 'components/shared/flyout';
import { RuleSummary } from '..';

import './deleteRule.scss';

export class DeleteRule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPending: false,
      error: undefined,
      changesApplied: undefined,
      confirmed: false,
      ruleDeleted: undefined
    };
  }

  componentDidMount() {
    if (this.props.rule) {
      const { rule } = this.props;
      this.setState({
        rule,
        status: !rule.enabled
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rule) {
      const { rule } = nextProps;
      this.setState({
        rule,
        status: !rule.enabled
      });
    }
  }

  componentWillUnmount() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onDelete = ({ target: { value } }) => {
    if (this.state.changesApplied) {
      this.setState({ status: value, changesApplied: false });
    } else {
      this.setState({ status: value });
    }
  }

  deleteRule = (event) => {
    event.preventDefault();
    const { rule } = this.state;
    this.setState({ isPending: true, error: null });
    this.subscription =
      TelemetryService.deleteRule(rule.id)
        .subscribe(
          updatedRule => {
            this.props.refresh();
            this.setState({ isPending: false, changesApplied: true, ruleDeleted: true });
          },
          error => this.setState({ error, isPending: false, changesApplied: true })
        );
  }

  changeRuleStatus = (event) => {
    event.preventDefault();
    const { rule, status } = this.state;
    this.setState({ isPending: true, error: null });
    rule.enabled = status;
    this.subscription =
      TelemetryService.updateRule(rule.id, toEditRuleRequestModel(rule))
        .subscribe(
          (updatedRule) => {
            this.props.refresh();
            this.setState({ isPending: false, changesApplied: true, ruleDeleted: false });
          },
          error => this.setState({ error, isPending: false, changesApplied: true })
        );
  }

  confirmDelete = (event) => {
    event.preventDefault();
    this.setState({
      confirmed: true
    });
  }

  render() {
    const { onClose, t } = this.props;
    const { isPending, error, changesApplied, rule } = this.state;
    const completedSuccessfully = changesApplied && !error;

    return (
      <Flyout.Container header={t('rules.flyouts.deleteRule.title')} t={t} onClose={onClose}>
          <Protected permission={permissions.deleteRules}>
            <form onSubmit={this.deleteRule} className="delete-rule-flyout-container">
              {rule && <RuleSummary rule={rule} isPending={isPending} completedSuccessfully={completedSuccessfully} t={t} className="rule-details"/>}
              {error && <AjaxError className="rule-delete-error" t={t} error={error} />}
              {!error &&
                (changesApplied
                ? this.renderConfirmation()
                : this.renderButtons())
              }
            </form>
          </Protected>
      </Flyout.Container>
    );
  }

  renderButtons() {
    const { confirmed } = this.state;
    return (
      confirmed ? this.renderDeleteDisableButtons() : this.renderInitialDeleteButtons()
    );
  }

  renderDeleteDisableButtons() {
    const { t } = this.props;
    const { isPending, status, changesApplied, rule } = this.state;
    return (
      <div>
        <div className="delete-info">
          <Svg className="asterisk-svg" path={svgs.error} />
          <div className="delete-info-text">
            <Trans i18nKey="rules.flyouts.deleteRule.preDeleteText">
              keep...<Link to={`/maintenance/rule/${rule.id}`}>{t(`rules.flyouts.deleteRule.maintenancePage`)}</Link>...to remove
            </Trans>
          </div>
        </div>
        <BtnToolbar>
          <Btn primary={true} disabled={!!changesApplied || isPending} type="submit">{t('rules.flyouts.deleteRule.delete')}</Btn>
          {
            !status &&
            <Btn key="disable" className="rule-status-btn" svg={svgs.disableToggle} onClick={this.changeRuleStatus}>
              <Trans i18nKey="rules.flyouts.disable">Disable</Trans>
            </Btn>
          }
          { this.renderCancelButton() }
        </BtnToolbar>
      </div>
    );
  }

  renderInitialDeleteButtons() {
    const { t } = this.props;
    const { isPending, changesApplied } = this.state;
    return (
      <BtnToolbar>
        <Btn primary={true} disabled={!!changesApplied || isPending} onClick={this.confirmDelete}>{t('rules.flyouts.deleteRule.delete')}</Btn>
        { this.renderCancelButton() }
      </BtnToolbar>
    );
  }

  renderCancelButton() {
    const { onClose, t } = this.props;
    return (
      <Btn svg={svgs.cancelX} onClick={onClose}>{t('rules.flyouts.deleteRule.cancel')}</Btn>
    );
  }

  renderConfirmation() {
    const { onClose, t } = this.props;
    const { ruleDeleted, rule } = this.state;
    const confirmationKey = ruleDeleted ? "rules.flyouts.deleteRule.deleteConfirmation" : "rules.flyouts.deleteRule.disableConfirmation";
    return (
      <div>
        <div className="delete-confirmation">
          <div className="delete-confirmation-text">
            <Trans i18nKey={confirmationKey}>Disable</Trans>
            <Svg className="check-svg" path={svgs.checkmark} />
          </div>
          {ruleDeleted && <div className="post-delete-info-text">
            <Trans i18nKey={"rules.flyouts.deleteRule.postDeleteText"}>
              ...<Link to={`/maintenance/rule/${rule.id}`}>{t(`rules.flyouts.deleteRule.maintenancePage`)}</Link>...
            </Trans>
          </div>}
        </div>
        <BtnToolbar>
          <Btn primary={true} svg={svgs.cancelX} onClick={onClose}>{t('rules.flyouts.deleteRule.close')}</Btn>
        </BtnToolbar>
        </div>
    );
  }
}
