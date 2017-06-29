// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import SearchableDataGrid from '../../framework/searchableDataGrid/searchableDataGrid';


class AlarmList extends Component {

    render() {
        return (
            <SearchableDataGrid
                datasource="api/v1/alarm/{timerange}"
                multiSelect={false}
                title=""
                showLastUpdate={false}
                urlSearchPattern="/\{timerange\}/i"
                eventDataKey="id"
                enableSearch={false}
                autoLoad={true}
                topics={
                    [
                        "system.dashboard.alarmTimerange.selected"
                    ]
                }
                initFilter="P1Y"
                filters={
                    [
                        {
                            "title":"Select Time Range",
                            "items":[
                                {
                                    "text":"Last 1 month",
                                    "id":"P1M"
                                },
                                {
                                    "text":"Last 3 month",
                                    "id":"P3M"
                                },
                                {
                                    "text":"Last 6 month",
                                    "id":"P6M"
                                },
                                {
                                    "text":"Last 1 year",
                                    "id":"P1Y"
                                }
                            ]
                        }
                    ]
                }
                columns="RuleID:ruleId, Occurrences:occurrences, Description:description, Severity:severity, LastIncidentUtc:lastIncident, Status:status"
            >
            </SearchableDataGrid>
        );
    }
}

export default AlarmList;