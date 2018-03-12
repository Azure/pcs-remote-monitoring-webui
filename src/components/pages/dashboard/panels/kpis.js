// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Observable } from 'rxjs';

import { Indicator } from 'components/shared';
import {
  Panel,
  PanelHeader,
  PanelContent,
  PanelOverlay
} from 'components/pages/dashboard/panel';

export class KpisPanel extends Component {
  constructor(props) {
    super(props);

    this.state = { isPending: true };
  }

  componentDidMount() {
    this.subscription = Observable.interval(8000).startWith(0).map(_ => 'isPending')
      .flatMap(key => Observable.of({
          [key]: false
        }).delay(Math.random()*5000).startWith({
          [key]: true
        })
      )
      .subscribe(state => this.setState(state));
  }

  componentWillUnmount() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  render() {
    return (
      <Panel>
        <PanelHeader>System KPIs</PanelHeader>
        <PanelContent>
          Contents
        </PanelContent>
        { this.state.isPending && <PanelOverlay><Indicator /></PanelOverlay> }
      </Panel>
    );
  }
}
