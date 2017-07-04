// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import EventTopic from '../../common/eventtopic';
import Http from "../../common/httpClient";
import DeviceGroupEditor from "../../components/deviceGroupEditor/deviceGroupEditor";
import './genericDropDownList.css';

import $ from 'jquery';
window.jQuery = $;
require('bootstrap');

class GenericDropDownList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            items: [],
            selectedIds: [],
            loading: true
        };
    }

    componentDidMount() {
        this.subscriptions = [];
        if (this.props.reloadRequestTopic) {
            this.subscriptions.push(EventTopic.subscribe(this.props.reloadRequestTopic, (topic, data, publisher)=>this.onReloadRequest(topic, data, publisher)));
        }

        this.getItemList();
    }

    componentWillUnmount() {
        EventTopic.unsubscribe(this.subscriptions);
    }

    getItemList(query) {
        if (this.props.requestUrl) {
            var url = this.props.requestUrl;
            if (query) {
                url += "/" + query;
            }

            Http.get(url)
                .then((data) => this.setItems(data))
                .catch((err) => console.log(err));

            this.setState({ loading: true });
        } else {
            this.setItems(this.props.items || []);
        }
    }

    setItems(items) {
        // Normalize items to object array
        items = items.map(item => typeof item === "object" ? item : { id: item, text: item, selected: false });

        // Get selected ids
        var selectedIds = [];
        var ids = items.map(item => item.id);

        if (this.props.initialState.selectFirstItem && ids.length > 0) {
            // select the first item
            selectedIds.push(ids[0]);
        }

        if (this.props.initialState.keepLastSelection) {
            // keep last selection
            selectedIds = selectedIds.concat(this.state.selectedIds.filter(id => ids.indexOf(id) >= 0 && selectedIds.indexOf(id) < 0));
        }

        // Apply selected flag in items
        items.forEach(item => {
            if (item.selected && selectedIds.indexOf(item.id) < 0) {
                selectedIds.push(item.id);
            }
        });

        this.setState({
            items: items,
            selectedIds: selectedIds,
            loading: false
        });
    }

    onClickItem(item) {
        var selectedIds;

        if (this.props.multipleSelect) {
            selectedIds = this.state.selectedIds;

            var id = item.target.dataset.id;
            var index = selectedIds.indexOf(id);

            if (index < 0) {
                selectedIds.push(id);
            } else {
                selectedIds.splice(index, 1);
            }            
        } else {
            selectedIds = [item.target.dataset.id];
        }

        this.setState({ selectedIds: selectedIds });
    }

    onSelectAll() {
        var selectedIds;

        if (this.state.selectedIds.length === this.state.items.length) {
            selectedIds = [];
        } else {
            selectedIds = this.state.items.map(item => item.id);
        }

        this.setState({ selectedIds: selectedIds });
    }

    onNewItem() {
        this.setState({showModal: true});
    }

    onEditItem() {
        this.setState({showModal: true});
    }

    onReloadRequest(topic, data, publisher) {
        this.getItemList(data);
    }

    renderItem(item) {
        if (this.props.multipleSelect) {
            return (
                <li key={item.id}>
                    <a onClick={(e)=>this.onClickItem(e)} data-id={item.id}>
                        <input type="checkbox" checked={this.state.selectedIds.indexOf(item.id) >= 0} data-id={item.id}/>
                        {item.text}
                        {this.props.editItem && this.renderEditItem()}
                    </a>
                </li>
            );
        } else {
            return (
                <li key={item.id}>
                    <a onClick={(e)=>this.onClickItem(e)} data-id={item.id}>
                        {item.text}
                        {this.props.editItem && this.renderEditItem()}
                    </a>
                </li>
            );
        }
    }

    renderEditItem() {
        return <span style={{float: "right", cursor: "pointer"}} onClick={(e)=>this.onEditItem(e)}>{this.props.editItem.text}</span>;
    }

    render() {
        EventTopic.publish(this.props.publishTopic, this.state.selectedIds, this);

        return (
            <div className="dropdown">
                <button className="btn btn-default btn-block dropdown-toggle genericDropDownListWrap" type="button" data-toggle="dropdown" disabled={this.state.loading} >
                    {this.state.items.filter(item => this.state.selectedIds.indexOf(item.id) >= 0).map(item => item.text).join(", ") || this.props.initialState.defaultText}
                    <span className="caret"></span>
                </button>
                <ul className={"dropdown-menu " + (this.props.menuAlign === "right" ? "dropdown-menu-right" : "")}>
                    {
                        this.props.multipleSelect && this.props.selectAll && <li key="_selectAll"><a onClick={(e)=>this.onSelectAll(e)}><input type="checkbox" className="genericDropDownListItemSelectAll" checked={this.state.selectedIds.length === this.state.items.length} /> {this.props.selectAll.text}</a></li>
                    }
                    {
                        this.state.items && this.state.items.map((item)=>this.renderItem(item))
                    }
                    {
                        this.props.newItem && <li key="_newItem"><a onClick={(e)=>this.onNewItem(e)}>{this.props.newItem.text}</a></li>
                    }
                </ul>
                {
                    this.props.newItem && 
                    <Modal ref='deviceGroupEditorModal' show={this.state.showModal} bsSize='large'>
                        <Modal.Body>
                            <DeviceGroupEditor onClose={()=>this.setState({showModal: false})}/>
                        </Modal.Body>
                    </Modal>
                }
            </div>
        );
    }
}

export default GenericDropDownList;