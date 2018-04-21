// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { RuleEditorContainer } from './ruleEditor';
import Flyout from 'components/shared/flyout';

export const EditRuleFlyout = ({ t, onClose, rule }) => (
  <Flyout.Container>
    <Flyout.Header>
      <Flyout.Title>{t('rules.flyouts.editRule')}</Flyout.Title>
      <Flyout.CloseBtn onClick={onClose} />
    </Flyout.Header>
    <Flyout.Content>
      <RuleEditorContainer onClose={onClose} rule={rule} />
    </Flyout.Content>
  </Flyout.Container>
);
