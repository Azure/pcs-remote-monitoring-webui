// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../actions";
import { isFunction } from "../../common/utils";
import PcsGrid from '../pcsGrid/pcsGrid';
import {
  checkboxParams,
  rulesAndActionsColumnDefs,
  defaultRulesAndActionsGridProps
} from './ruleAndActionsConfig';
import Spinner from '../spinner/spinner';

import "./rulesActionsList.css";

class RulesActionsList extends Component {

  constructor(props) {
    super(props);

    this.columnDefs = [
      { ...rulesAndActionsColumnDefs.ruleName, ...checkboxParams },
      rulesAndActionsColumnDefs.description,
      rulesAndActionsColumnDefs.severity,
      rulesAndActionsColumnDefs.filter,
      rulesAndActionsColumnDefs.trigger,
      rulesAndActionsColumnDefs.notificationType,
      rulesAndActionsColumnDefs.status,
      rulesAndActionsColumnDefs.count,
      rulesAndActionsColumnDefs.lastTrigger
    ];
  }

  /** 
   * Get the grid api options 
   * 
   * @param {Object} gridReadyEvent An object containing access to the grid APIs   
   */
   onGridReady = gridReadyEvent => {
    this.gridApi = gridReadyEvent.api;

    this.gridApi.sizeColumnsToFit();
    // Call the onReady props if it exists
    if (isFunction(this.props.onGridReady)) {
      this.props.onGridReady(gridReadyEvent);
    }
  }

  render() {
    const gridProps = {
      ...defaultRulesAndActionsGridProps,
      columnDefs: this.columnDefs,
      ...this.props,
      onGridReady: this.onGridReady
    };
    return (
      <div className="rules-actions-container">
        <PcsGrid {...gridProps} />
        {this.props.showSpinner && <div className='spinner-container'><Spinner /></div>}
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(null, mapDispatchToProps)(RulesActionsList);
