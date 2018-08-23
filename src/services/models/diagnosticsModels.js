// Copyright (c) Microsoft. All rights reserved.

export const toDiagnosticsRequestModel = (request = {}) => ({
  EventType: request.eventType,
  EventProperties: request.eventProperties,
  SessionId: request.sessionId
});

export const toDiagnosticsModel = (eventType, eventProperties) => ({
  eventType,
  eventProperties
});
