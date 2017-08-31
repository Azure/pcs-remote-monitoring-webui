// Copyright (c) Microsoft. All rights reserved.

import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import lang from "../../common/lang";
import Flyout from "../flyout/flyout";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import SeverityCellRenderer from "./severityCellRenderer";
import SearchableDataGrid from "../../framework/searchableDataGrid/searchableDataGrid";
import StatusCellRenderer from "./statusCellRenderer";
import deviceCountCellRenderer from "./deviceCountCellRenderer";
import LastTriggerCellRenderer from "./lastTriggerCellRenderer";
import ApiService from "../../common/apiService";
import {formatString} from "../../common/utils";
import * as actions from "../../actions";

import "./rulesActionsList.css";


const RulesActionsHeaderHeight = 48;
const RulesActionsRowHeight = 48;

class RulesActionsList extends Component {
    constructor(props) {
        super(props);

        this.columnDefs = [
            {
                headerName: lang.RULESACTIONS.RULENAME,
                field: 'Name',
                filter: 'text'
            },
            {
                headerName: lang.RULESACTIONS.DESCRIPTION,
                field: 'Description',
                filter: 'text'
            },
            {
                headerName: lang.RULESACTIONS.SEVERITY,
                field: 'Severity',
                filter: 'text',
                cellRendererFramework: SeverityCellRenderer
            },
            {
                headerName: lang.RULESACTIONS.SOURCE,
                field: 'GroupId',
                filter: 'text'
            },
            {
                headerName: lang.RULESACTIONS.TRIGGER,
                field: 'Conditions',
                filter: 'text',
                valueFormatter: (params) => {
                    if (params.value && Array.isArray(params.value) && params.value.length) {
                        return params.value.map(trigger => trigger['Field'] || 'Unknown').join(' and ');
                    }
                    return 'Unknown'
                }
            },
            {
                headerName: lang.RULESACTIONS.NOTIFICATIONTYPE,
                field: 'Action.Type',
                filter: 'text',
                valueFormatter: (params) => {
                    return params.value || lang.RULESACTIONS.ALARMLOG
                }
            },
            {
                headerName: lang.RULESACTIONS.STATUS,
                field: 'Enabled',
                filter: 'text',
                cellRendererFramework: StatusCellRenderer
            },
            {
                headerName: lang.RULESACTIONS.COUNT,
                cellRendererFramework: deviceCountCellRenderer,
            },
            {
                headerName: lang.RULESACTIONS.LASTTRIGGER,
                cellRendererFramework: LastTriggerCellRenderer
            }
        ];

        this.state = {
            rulesActions: [],
            showConfirmModal: false,
            showBoth: false,
            toggleButtonText: lang.RULESACTIONS.DISABLE
        }
    }

    getData = async (filter, callback) => {
        ApiService.getRuleList().then(data => {
            callback(data.Items);
        });
    };

    onRowSelectionChanged = rows => {
        let status;

        // All selected rows have same status field?
        let showBoth = !rows.every(row => {
            if (status === undefined) {
                status = row.Enabled
            } else if (status !== row.Enabled) {
                return false
            }
            return true;
        });

        this.setState(
            {
                rulesActions: rows,
                showBoth: showBoth,
                toggleButtonText: showBoth ? lang.RULESACTIONS.CHANGESTATUS : status ? lang.RULESACTIONS.DISABLE : lang.RULESACTIONS.ENABLE
            }
        );
    };

    newRule = () => {
        this.grid.gridApi.deselectAll();
        const {actions} = this.props;
        const flyoutConfig = {title: lang.RULESACTIONS.NEWRULE, type: 'New Rule'};
        actions.showFlyout({...flyoutConfig});
    };

    onCellClicked = (event) => {
        if (event.colDef.headerName !== lang.RULESACTIONS.ACTIONS) {
            const {actions} = this.props;
            actions.hideFlyout();
            const flyoutConfig = {title: lang.RULESACTIONS.RULEDETAIL, type: 'New Rule', rule: event.data};
            actions.showFlyout({...flyoutConfig});
        }
    };

    cancelDelete = () => {
        this.setState({showConfirmModal: false})
    };

    showDeleteRulesModal = () => {
        this.setState({showConfirmModal: true})
    };

    showEditRulesFlyout = () => {
        const {actions} = this.props;
        actions.hideFlyout();
        const flyoutConfig = {title: lang.RULESACTIONS.RULEDETAIL, type: 'New Rule', rule: this.state.rulesActions[0], inEdit: true};
        actions.showFlyout({...flyoutConfig});
    };

    confirmDelete = () => {
        let promises = [];
        this.state.rulesActions.forEach(rule => {
            promises.push(ApiService.deleteRule(rule.Id));
        });
        Promise.all(promises)
            .catch(err => {
                console.error(err);
            });
        this.setState({showConfirmModal: false})
    };

    showToggleRules = () => {
        const {actions} = this.props;
        const flyoutConfig = {selectedRules: this.state.rulesActions, type: 'Rule Detail'};
        actions.showFlyout({...flyoutConfig});
    };

    onFlyoutClose = () => {
        this.grid.refreshData();
        const {actions} = this.props;
        actions.hideFlyout();
    };

    render() {
        const {flyout} = this.props;
        const flyoutProp = {
            show: flyout.show,
            onClose: this.onFlyoutClose,
            content: flyout.content
        };

        let ActionButtons = {};
        ActionButtons.newRuleButton =
            <div className="button" onClick={this.newRule}>
                <div className="button-icon add"/>
                <div className="button-text">{lang.RULESACTIONS.NEWRULE}</div>
            </div>;
        if (this.state.rulesActions.length) {
            ActionButtons.deleteRulesButton =
                <div className="button" onClick={this.showDeleteRulesModal}>
                    <div className="button-icon delete"/>
                    <div className="button-text">{lang.RULESACTIONS.DELETE}</div>
                </div>;
            ActionButtons.disableRulesButton =
                <div className="button" onClick={this.showToggleRules}>
                    <div
                        className={this.state.showBoth ? 'enableDisable' : this.state.toggleButtonText.toLocaleLowerCase()}/>
                    <div className="button-text">{this.state.toggleButtonText}</div>
                </div>;
            if (this.state.rulesActions.length === 1) {
                ActionButtons.editRulesButton =
                    <div className="button" onClick={this.showEditRulesFlyout}>
                        <div className="botton-icon edit"/>
                        <div className="button-text">{lang.RULESACTIONS.EDIT}</div>
                    </div>;
            }
        }
        const actionButtonBar =
            <div className="rulesActionsButtonContainer">
                {ActionButtons.newRuleButton}
                {ActionButtons.deleteRulesButton}
                {ActionButtons.disableRulesButton}
                {ActionButtons.editRulesButton}
            </div>;

        return (
            <div ref="container" className="rulesActionsContainer">
                <Flyout {...flyoutProp}/>
                {actionButtonBar}
                <div className="rulesActionsListContainer">
                    <SearchableDataGrid
                        ref={(grid) => {
                            this.grid = grid
                        }}
                        headerHeight={RulesActionsHeaderHeight}
                        rowHeight={RulesActionsRowHeight}
                        getData={this.getData}
                        multiSelect={true}
                        title=""
                        showLastUpdate={true}
                        eventDataKey="0"
                        enableSearch={false}
                        autoLoad={true}
                        columnDefs={this.columnDefs}
                        pagination={false}
                        onRowSelectionChanged={this.onRowSelectionChanged}
                        onCellClicked={this.onCellClicked}
                    />
                </div>

                <Modal show={this.state.showConfirmModal}>
                    <Modal.Header>
                        <Modal.Title>{lang.RULESACTIONS.DELETERULES}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {formatString(lang.RULESACTIONS.RULESWILLBEDELETED, this.state.rulesActions.length)}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.cancelDelete}>{lang.RULESACTIONS.CANCEL}</Button>
                        <Button bsStyle="primary" onClick={this.confirmDelete}>{lang.RULESACTIONS.CONFIRM}</Button>
                    </Modal.Footer>

                </Modal>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

const mapStateToProps = state => {
    return {
        flyout: state.flyoutReducer,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RulesActionsList);
