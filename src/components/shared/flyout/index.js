// Copyright (c) Microsoft. All rights reserved.

// Exports the shared react components into as a library

import { Flyout } from './flyout';
import { FlyoutHeader } from './flyoutHeader';
import { FlyoutTitle } from './flyoutTitle';
import { FlyoutCloseBtn } from './flyoutCloseBtn';
import { FlyoutContent } from './flyoutContent';
import Section from './flyoutSection';

export * from './flyout';
export * from './flyoutHeader';
export * from './flyoutTitle';
export * from './flyoutCloseBtn';
export * from './flyoutContent';
export * from './flyoutSection'

export default {
  Container: Flyout,
  Header: FlyoutHeader,
  Title: FlyoutTitle,
  CloseBtn: FlyoutCloseBtn,
  Content: FlyoutContent,
  Section: Section
};
