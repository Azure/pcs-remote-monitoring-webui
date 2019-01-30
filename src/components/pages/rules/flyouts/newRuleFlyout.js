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
    <Flyout.Container header={t('rules.flyouts.newRule')} onClose={this.onTopXClose}>
        <Protected permission={permissions.createRules}>
          <RuleEditorContainer onClose={onClose} />
        </Protected>
    </Flyout.Container>
  );
 }
}
