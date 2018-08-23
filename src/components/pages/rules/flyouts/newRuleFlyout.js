// Copyright (c) Microsoft. All rights reserved.

import React, { Component }  from 'react';
import { permissions, toDiagnosticsModel } from 'services/models';
import { Protected } from 'components/shared';
import { RuleEditorContainer } from './ruleEditor';
import Flyout from 'components/shared/flyout';

export class NewRuleFlyout extends Component {

  onTopXClose = () => {
    const { logEvent, onClose } = this.props;
    logEvent(toDiagnosticsModel('Rule_TopXCloseClick', {}));
    onClose();
  }

 render () {
  const { onClose, t } = this.props;
  return (
    <Flyout.Container>
      <Flyout.Header>
        <Flyout.Title>{t('rules.flyouts.newRule')}</Flyout.Title>
        <Flyout.CloseBtn onClick={this.onTopXClose} />
      </Flyout.Header>
      <Flyout.Content>
        <Protected permission={permissions.createRules}>
          <RuleEditorContainer onClose={onClose} />
        </Protected>
      </Flyout.Content>
    </Flyout.Container>
  );
 }
}
