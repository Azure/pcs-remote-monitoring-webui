// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';

import './pcsGrid.css';

const ROW_HEIGHT = 48;

/** A helper function that returns true if the input is a function, false otherwise */
const isFunc = value => typeof value === 'function';

/**
 * PcsGrid is a helper wrapper around AgGrid. The primary functionality of this wrapper
 * is to allow easy reuse of the pcs dark grid theme. To see params, read the AgGrid docs.
 * 
 * Props:
 *  getSoftSelectId: A method that when provided with the a row data object returns an id for that object
 *  softSelectId: The ID of the row data to be soft selected
 * 
 * TODO (stpryor): Add design pagination
 */
export class PcsGrid extends Component {

    constructor(props) {
        super(props);
        this.state = { currentSoftSelectId: '' };
    }

    /** When new props are passed in, check if the soft select state needs to be updated */
    componentWillReceiveProps(nextProps) {
        if (this.currentSoftSelectId !== nextProps.softSelectId) {
            this.setState({ currentSoftSelectId: nextProps.softSelectId }, this.refreshRows);
        }
    }

    /** Save the gridApi locally on load */
    onGridReady = gridReadyEvent => {
        this.gridApi = gridReadyEvent.api;
        if (isFunc(this.props.onGridReady)) {
            this.props.onGridReady(gridReadyEvent);
        }
    }

    /** Refreshes the grid to update soft select CSS states */
    refreshRows = () => this.gridApi.rowRenderer.refreshRows(this.gridApi.getRenderedNodes());

    /** Computes the CSS classes to apply to each row, including soft select */
    getRowClass = params => {
        let rowClasses = '';
        if (isFunc(this.props.getSoftSelectId)) {
            rowClasses = this.props.getSoftSelectId(params.data) === this.props.softSelectId ? 'pcs-row-soft-selected' : '';
        }
        if (isFunc(this.props.getRowClass)) {
            rowClasses += ` ${this.props.getRowClass(params)}`;
        }
        return rowClasses;
    }

    render() {
        const gridParams = {
            ...this.props,
            headerHeight: ROW_HEIGHT,
            rowHeight: ROW_HEIGHT,
            getRowClass: this.getRowClass,
            onGridReady: this.onGridReady
        };
        return (
            <div className="pcs-grid-container ag-dark pcs-ag-dark">
                <AgGridReact {...gridParams} />
            </div>
        );
    }
}

export default PcsGrid;
