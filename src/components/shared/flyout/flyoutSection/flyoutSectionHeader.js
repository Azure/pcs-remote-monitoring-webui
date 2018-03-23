// Copyright (c) Microsoft. All rights reserved.

import React from'react';

import { withAccordion } from './accordionProvider';
import { Svg } from 'components/shared/svg/svg';
import { svgs, joinClasses } from 'utilities';

export const FlyoutSectionHeader = withAccordion(
  ({ accordionIsCollapsable, className, children, toggleAccordion, accordionIsOpen }) => {
    const sectionProps = { className: joinClasses('flyout-section-header', className) };
    return (
      accordionIsCollapsable
        ? <button {...sectionProps} onClick={toggleAccordion}>
            { children }
            {
              accordionIsCollapsable &&
              <Svg path={svgs.chevron} className={joinClasses('collapse-section-icon', accordionIsOpen ? 'expanded' : 'collapsed')} />
            }
          </button>
        : <div {...sectionProps}>
            { children }
          </div>

    );
  }
);
