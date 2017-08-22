// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import ApiService from "../../common/apiService";

export default class ActionCellRenderer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            cell: {
                row: props.data,
                col: props.colDef.headerName
            }
        };

        this.loading = false;
    }

    onEdit = () => {
        // TODO: open rule detail flyout in edit mode
    };

    onToggle = () => {
        this.setState({loading: true});
        let row = Object.assign({}, this.state.cell.row, {Enabled: !this.state.cell.row.Enabled});
        this.setState({cell: {row}}, () => {
            let self = this;
             ApiService.updateRule(this.state.cell.row.Id,this.state.cell.row)
                .then(response => {
                    this.props.node.setData(row);
                    self.setState({loading: false});
                    console.log(response);
                })
                .catch(err => {
                    this.props.node.setData(row);
                    self.setState({loading: false});
                    console.error(err);
                })
        });
    };


    render() {
        return (
            <div className={`rulesActionsButtonContainer ${this.state.loading ? 'loader' : ''}`}>
                <div className="button cell-button" onClick={this.onEdit}>
                    <div className="button-icon edit"/>
                </div>
                {this.state.cell.row.Enabled
                    ?
                    <div className="button cell-button" onClick={() => this.onToggle()}>
                        <div className="button-icon disable"/>
                    </div>
                    :
                    <div className="button cell-button" onClick={() => this.onToggle()}>
                        <div className="button-icon enable"/>
                    </div>
                }
            </div>

        )
    }
}
