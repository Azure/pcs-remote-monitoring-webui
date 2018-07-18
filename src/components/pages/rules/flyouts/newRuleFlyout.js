// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { permissions } from 'services/models';
import { Protected } from 'components/shared';
import { RuleEditorContainer } from './ruleEditor';
import Flyout from 'components/shared/flyout';

export const NewRuleFlyout = ({ t, onClose }) => (
  <Flyout.Container>
    <Flyout.Header>
      <Flyout.Title>{t('rules.flyouts.newRule')}</Flyout.Title>
      <Flyout.CloseBtn onClick={onClose} />
    </Flyout.Header>
    <Flyout.Content>
      <Protected permission={permissions.createRules}>
        <RuleEditorContainer onClose={onClose} />
      </Protected>
    </Flyout.Content>
  </Flyout.Container>
);
