// Copyright (c) Microsoft. All rights reserved.

// <flyout>
import React, { Component } from 'react';

import { ExampleService } from 'walkthrough/services';
import { svgs } from 'utilities';
import {
  AjaxError,
  Btn,
  BtnToolbar,
  Flyout,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutCloseBtn,
  FlyoutContent,
  Indicator,
  SectionDesc,
  SectionHeader,
  SummaryBody,
  SummaryCount,
  SummarySection,
  Svg
} from 'components/shared';

import './exampleFlyout.scss';

export class ExampleFlyout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemCount: 3, //just a fake count; this would often be a list of items that are being acted on
      isPending: false,
      error: undefined,
      successCount: 0,
      changesApplied: false
    };
  }

  componentWillUnmount() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  apply = (event) => {
    event.preventDefault();
    this.setState({ isPending: true, successCount: 0, error: null });

    this.subscription = ExampleService.updateExampleItems()
      .subscribe(
        _ => {
          this.setState({ successCount: this.state.successCount + this.state.itemCount });
          // Update any global state in the redux store by calling any
          // dispatch methods that were mapped in this flyout's container.
        },
        error => this.setState({ error, isPending: false, changesApplied: true }),
        () => this.setState({ isPending: false, changesApplied: true, confirmStatus: false })
      );
  }

  getSummaryMessage() {
    const { t } = this.props;
    const { isPending, changesApplied } = this.state;

    if (isPending) {
      return t('walkthrough.pageWithFlyout.flyouts.example.pending');
    } else if (changesApplied) {
      return t('walkthrough.pageWithFlyout.flyouts.example.applySuccess');
    } else {
      return t('walkthrough.pageWithFlyout.flyouts.example.affected');
    }
  }

  render() {
    const { t, onClose } = this.props;
    const {
      itemCount,
      isPending,
      error,
      successCount,
      changesApplied
    } = this.state;

    const summaryCount = changesApplied ? successCount : itemCount;
    const completedSuccessfully = changesApplied && !error;
    const summaryMessage = this.getSummaryMessage();

    return (
      <Flyout>
        <FlyoutHeader>
          <FlyoutTitle>{t('walkthrough.pageWithFlyout.flyouts.example.header')}</FlyoutTitle>
          <FlyoutCloseBtn onClick={onClose} />
        </FlyoutHeader>
        <FlyoutContent>
          {
            /**
             * Really, anything you need could go inside a flyout.
             * The following is a simple empty form with buttons to do an action or close the flyout.
             * */
          }
          <form className="example-flyout-container" onSubmit={this.apply}>
            <div className="example-flyout-header">{t('walkthrough.pageWithFlyout.flyouts.example.header')}</div>
            <div className="example-flyout-descr">{t('walkthrough.pageWithFlyout.flyouts.example.description')}</div>

            <div className="form-placeholder">{t('walkthrough.pageWithFlyout.flyouts.example.insertFormHere')}</div>

            {/** Sumarizes the action being taken; including count of items affected & status/pending indicator */}
            <SummarySection>
              <SectionHeader>{t('walkthrough.pageWithFlyout.flyouts.example.summaryHeader')}</SectionHeader>
              <SummaryBody>
                <SummaryCount>{summaryCount}</SummaryCount>
                <SectionDesc>{summaryMessage}</SectionDesc>
                {this.state.isPending && <Indicator />}
                {completedSuccessfully && <Svg className="summary-icon" path={svgs.apply} />}
              </SummaryBody>
            </SummarySection>

            {/** Displays an error message if one occurs while applying changes. */}
            {error && <AjaxError className="example-flyout-error" t={t} error={error} />}
            {
              /** If changes are not yet applied, show the buttons for applying changes and closing the flyout. */
              !changesApplied &&
              <BtnToolbar>
                <Btn svg={svgs.reconfigure} primary={true} disabled={isPending || itemCount === 0 } type="submit">{t('walkthrough.pageWithFlyout.flyouts.example.apply')}</Btn>
                <Btn svg={svgs.cancelX} onClick={onClose}>{t('walkthrough.pageWithFlyout.flyouts.example.cancel')}</Btn>
              </BtnToolbar>
            }
            {
              /**
               * If changes are applied, show only the close button.
               * Other text or component might be included here as well.
               * For example, you might provide a link to the detail page for a newly submitted job.
               * */
              !!changesApplied &&
              <BtnToolbar>
                <Btn svg={svgs.cancelX} onClick={onClose}>{t('walkthrough.pageWithFlyout.flyouts.example.close')}</Btn>
              </BtnToolbar>
            }
          </form>
        </FlyoutContent>
      </Flyout>
    );
  }
}
// </flyout>
