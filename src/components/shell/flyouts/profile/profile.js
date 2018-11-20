// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Trans } from 'react-i18next';

import Config from 'app.config';
import { svgs, getEnumTranslation } from 'utilities';
import {
  Btn,
  BtnToolbar,
  ErrorMsg,
  Hyperlink,
  PropertyGrid as Grid,
  PropertyRow as Row,
  PropertyCell as Cell,
} from 'components/shared';
import Flyout from 'components/shared/flyout';

import './profile.css';

const Section = Flyout.Section;

export const Profile = (props) => {
  const { t, user, logout, onClose } = props;

  const roleArray = Array.from(user.roles);
  const permissionArray = Array.from(user.permissions);

  return (
    <Flyout.Container>
      <Flyout.Header>
        <Flyout.Title>{t('profileFlyout.title')}</Flyout.Title>
        <Flyout.CloseBtn onClick={onClose} />
      </Flyout.Header>
      <Flyout.Content className="profile-container">
        {
          !user &&
          <div className="profile-container">
            <ErrorMsg className="profile-error">{t("profileFlyout.noUser")}</ErrorMsg>
            <Trans i18nKey={'profileFlyout.description'}>
              <Hyperlink href={Config.contextHelpUrls.rolesAndPermissions} target="_blank">{t('profileFlyout.learnMore')}</Hyperlink>
              about roles and permisions
            </Trans>
          </div>
        }
        {
          user &&
          <div className="profile-container">
            <div className="profile-header">
              <h2>{user.email}</h2>
              <Grid className="profile-header-grid">
                <Row>
                  <Cell className="col-7">
                    <Trans i18nKey={'profileFlyout.description'}>
                      <Hyperlink href={Config.contextHelpUrls.rolesAndPermissions} target="_blank">{t('profileFlyout.learnMore')}</Hyperlink>
                      about roles and permisions
                    </Trans>
                  </Cell>
                  <Cell className="col-3"><Btn primary={true} onClick={logout}>{t('profileFlyout.logout')}</Btn></Cell>
                </Row>
              </Grid>
            </div>

            <Section.Container>
              <Section.Header>{t('profileFlyout.roles')}</Section.Header>
              <Section.Content>
                {
                  (roleArray.length === 0)
                    ? t('profileFlyout.noRoles')
                    :
                    <Grid>
                      {
                        roleArray.map((roleName, idx) =>
                          <Row key={idx}>
                            <Cell>{roleName}</Cell>
                          </Row>
                        )
                      }
                    </Grid>
                }
              </Section.Content>
            </Section.Container>

            <Section.Container>
              <Section.Header>{t('profileFlyout.permissions')}</Section.Header>
              <Section.Content>
                {
                  (permissionArray.length === 0)
                    ? t('profileFlyout.noPermissions')
                    :
                    <Grid>
                      {
                        permissionArray.map((permissionName, idx) =>
                          <Row key={idx}>
                            <Cell>{getEnumTranslation(t, 'permissions', permissionName)}</Cell>
                          </Row>
                        )
                      }
                    </Grid>
                }
              </Section.Content>
            </Section.Container>

            <BtnToolbar>
              <Btn svg={svgs.cancelX} onClick={onClose}>{t('profileFlyout.close')}</Btn>
            </BtnToolbar>
          </div>
        }
      </Flyout.Content>
    </Flyout.Container>
  );
}
