// Copyright (c) Microsoft. All rights reserved.

import { FlyoutSection } from './flyoutSection';
import { FlyoutSectionHeader } from './flyoutSectionHeader';
import { FlyoutSectionContent } from './flyoutSectionContent';

export * from './flyoutSection';
export * from './flyoutSectionHeader';
export * from './flyoutSectionContent';

export default {
  Container: FlyoutSection,
  Header: FlyoutSectionHeader,
  Content: FlyoutSectionContent
};
