// Copyright (c) Microsoft. All rights reserved.

export const toDiagnosticsRequestModel = (request = {}) => ({
  EventType: request.eventType,
  EventProperties: request.eventProperties
});

export const toDiagnosticsModel = (eventType, eventProperties) => ({
  eventType,
  eventProperties
});
