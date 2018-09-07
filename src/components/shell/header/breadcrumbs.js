// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import { Svg } from 'components/shared';
import { svgs, isDef } from 'utilities';

const Crumb = ({ children }) => <div className="crumb">{children}</div>
const Chevron = () => <Svg path={svgs.chevronRight} className="chevron-icon" />;

const CrumbFromConfig = ({ t, crumb, match, isLast }) => {

  const separator = <Chevron key={`${crumb.to}-chevron`} />;

  if (isDef(crumb.labelId) && !isDef(crumb.matchParam)) {
    if (!isLast) {
      return [<NavLink to={crumb.to} className="crumb" key={crumb.to}>{t(crumb.labelId)}</NavLink>, separator]
    } else {
      return <Crumb to={crumb.to} key={crumb.to}>{t(crumb.labelId)}</Crumb>
    }
  } else if (!isDef(crumb.labelId) && isDef(crumb.matchParam)) {
    return <Crumb to={crumb.to} key={crumb.to}>{match.params[crumb.matchParam]}</Crumb>
  }
}

export const Breadcrumbs = ({ t, crumbsConfig }) => (
  <Switch>
    {
      crumbsConfig.map(({ path, crumbs }) =>
        <Route key={path} exact path={path} render={props => {
          return crumbs.map((crumb, idx) => <CrumbFromConfig {...props} key={crumb.to} t={t} crumb={crumb} isLast={idx === crumbs.length - 1} />);
        }} />
      )
    }
  </Switch>
);
