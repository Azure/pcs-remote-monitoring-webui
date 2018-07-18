// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { permissions } from 'services/models';
import { Protected, ProtectedError } from 'components/shared';
import { RuleEditorContainer } from './ruleEditor';
import Flyout from 'components/shared/flyout';

export const EditRuleFlyout = ({ t, onClose, rule }) => (
  <Flyout.Container>
    <Flyout.Header>
      <Flyout.Title>{t('rules.flyouts.editRule')}</Flyout.Title>
      <Flyout.CloseBtn onClick={onClose} />
    </Flyout.Header>
    <Flyout.Content>
      <Protected permission={permissions.updateRules}>{
        (hasPermission, permission) =>
          hasPermission
            ? <RuleEditorContainer onClose={onClose} rule={rule} />
            :
            <div>
              <ProtectedError t={t} permission={permission} />
              <p>A read-only view will be added soon as part of another PBI.</p>
            </div>
      }
      </Protected>
    </Flyout.Content>
  </Flyout.Container>
);
