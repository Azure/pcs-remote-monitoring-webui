// Copyright (c) Microsoft. All rights reserved.

import React, {Component} from "react";
import GenericDropDownList from "../../components/genericDropDownList/genericDropDownList";
import SearchableDataGrid from "../../framework/searchableDataGrid/searchableDataGrid";

class AlarmList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            gridHeight: 200
        }
    }

    componentDidMount() {
        this.setState({gridHeight: this.refs.container.clientHeight - this.refs.dropdown.clientHeight - 10});
    }

    render() {
        return (
            <div ref="container" style={{height: "100%"}}>
                <div ref="dropdown" style={{width: "10em"}}>
                    <GenericDropDownList
                        id="AlarmTimeRange"
                        items={[
                            {
                                "id": "P1M",
                                "text": "Last 1 month"
                            },
                            {
                                "id": "P3M",
                                "text": "Last 3 month"
                            },
                            {
                                "id": "P6M",
                                "text": "Last 6 month"
                            },
                            {
                                "id": "P1Y",
                                "text": "Last 1 year"
                            }
                        ]}
                        initialState={{
                            "defaultText": "Choose time range",
                            "selectFirstItem": true
                        }}
                        publishTopic="system.dashboard.alarmTimerange.selected"
                    >
                    </GenericDropDownList>
                </div>
                <SearchableDataGrid
                    datasource="api/v1/alarm/{timerange}"
                    multiSelect={false}
                    title=""
                    showLastUpdate={false}
                    urlSearchPattern="/\{timerange\}/i"
                    eventDataKey="id"
                    enableSearch={false}
                    autoLoad={true}
                    height={this.state.gridHeight}
                    topics={
                        [
                            "system.dashboard.alarmTimerange.selected"
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