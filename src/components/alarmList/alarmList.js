// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import Config from '../../common/config';
import { Topics } from '../../common/eventtopic';
import GenericDropDownList from '../../components/genericDropDownList/genericDropDownList';
import SearchableDataGrid from '../../framework/searchableDataGrid/searchableDataGrid';

class AlarmList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            gridHeight: 200
        }
    }

    static hookWindowResize() {
        (function () {
            let isRunning = false;
            window.addEventListener('resize', function () {
                if (isRunning) {
                    return;
                }
                isRunning = true;
                requestAnimationFrame(function () {
                    window.dispatchEvent(new CustomEvent('layoutResize'));
                    isRunning = false;
                });
            });
        })();
    }

    componentDidMount() {
        AlarmList.hookWindowResize();
        window.addEventListener("layoutResize", this.resize);
        this.setState({gridHeight: this.refs.container.clientHeight - this.refs.dropdown.clientHeight - 10});
    }

    resize = () => {
        this.setState({gridHeight: this.refs.container.clientHeight - this.refs.dropdown.clientHeight - 10});
    };

    render() {
        return (
            <div ref="container" style={{height: "100%"}}>
                <h4 style={{display: "inline-block", marginRight: "1em"}}>Alarm Status</h4>
                <div ref="dropdown" style={{width: "10em", display: "inline-block"}}>
                    <GenericDropDownList
                        id="AlarmTimeRange"
                        items={[
                            {
                                id: 'P1M',
                                text: 'Last 1 month'
                            },
                            {
                                id: 'P3M',
                                text: 'Last 3 month'
                            },
                            {
                                id: 'P6M',
                                text: 'Last 6 month'
                            },
                            {
                                id: 'P1Y',
                                text: 'Last 1 year'
                            }
                        ]}
                        initialState={{
                            defaultText: 'Choose time range',
                            selectFirstItem: true
                        }}
                        publishTopic={Topics.dashboard.alarmTimerange.selected}
                    >
                    </GenericDropDownList>
                </div>
                <SearchableDataGrid
                    datasource={`${Config.solutionApiUrl}api/v1/alarm/{timerange}`}
                    multiSelect={false}
                    title=""
                    showLastUpdate={false}
                    urlSearchPattern="/\{timerange\}/i"
                    eventDataKey="0"
                    enableSearch={false}
                    autoLoad={true}
                    height={this.state.gridHeight}
                    topics={
                        [
                            Topics.dashboard.alarmTimerange.selected
                        ]
                    }
                    columns="RuleID:ruleId, Occurrences:occurrences, Description:description, Severity:severity, LastIncidentUtc:lastIncident, Status:status"
                >
                </SearchableDataGrid>
            </div>
        );
    }
}

export default AlarmList;
