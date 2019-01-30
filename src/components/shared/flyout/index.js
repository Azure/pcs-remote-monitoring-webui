// Copyright (c) Microsoft. All rights reserved.

// Exports the shared react components into as a library

import { Flyout } from './flyout';
import Section from './flyoutSection';

export * from './flyout';
export * from './flyoutSection'

export default {
  Container: Flyout,
  Section: Section
};
