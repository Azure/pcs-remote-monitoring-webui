// Copyright (c) Microsoft. All rights reserved.

import React from 'react';
import { connect } from 'react-redux';
import EditPencil from '../../assets/icons/EditPencil.svg';
import Trash from '../../assets/icons/Trash.svg';
import Add from '../../assets/icons/Add.svg';
import Apply from '../../assets/icons/Apply.svg';
import CancelX from '../../assets/icons/CancelX.svg';
import Remove from '../../assets/icons/Remove.svg';
import Select from 'react-select';
import Config from '../../common/config';
import lang from '../../common/lang';
import './manageFilterFlyout.css';
import {
  saveOrUpdateFilter,
  deleteFilter
} from '../../actions/manageFiltersFlyoutActions';

class ManageFiltersFlyout extends React.Component {
  constructor() {
    super();
    this.state = {
      allFields: [],
      editingState: {},
      showCreateFilter: false
    };
  }

  componentWillMount() {
    this.saveDeviceGroups();
    this.processFieldValues();
    this.processOperatorValues();
  }

  componentWillReceiveProps(nextProps) {
    setTimeout(() => {
      this.saveDeviceGroups();
      this.processFieldValues();
      this.processOperatorValues();
    });
  }

  saveDeviceGroups() {
    const { content } = this.props;
    const deviceGroups = content.deviceGroups || [];
    this.oldDeviceGroups = JSON.parse(JSON.stringify(deviceGroups));
    const newGroupObj = {
      id: 0,
      displayName: '',
      conditions: [
        {
          key: 'tags.region',
          operator: 'EQ',
          value: ''
        }
      ]
    };
    this.props.content.deviceGroups = [newGroupObj, ...deviceGroups];
  }

  processFieldValues() {
    const { content } = this.props;
    const deviceGroups = content.deviceGroups || [];
    const fields = [];
    deviceGroups.forEach(group => {
      if (!group.conditions) {
        return;
      }
      group.conditions.forEach(cond => {
        if (fields.indexOf(cond.key) === -1) {
          fields.push(cond.key);
        }
      });
    });
    this.setState({
      allFields: fields
    });
  }

  processOperatorValues() {
    const { content } = this.props;
    const deviceGroups = content.deviceGroups || [];

    const operators = [];
    deviceGroups.forEach(group => {
      if (!group.conditions) {
        return;
      }
      group.conditions.forEach(cond => {
        if (operators.indexOf(cond.operator) === -1) {
          operators.push(cond.operator);
        }
      });
    });
    this.setState({
      allOperators: operators
    });
  }

  restoreFilter(groupId) {
    const oldDeviceGroups = this.oldDeviceGroups;
    const { content } = this.props;
    const deviceGroups = content.deviceGroups || [];
    deviceGroups.forEach(group => {
      if (group.id === groupId) {
        oldDeviceGroups.forEach(oldGroup => {
          if (oldGroup.id === groupId) {
            group.displayName = oldGroup.displayName;
            group.conditions = oldGroup.conditions;
          }
        });
      }
    });
  }

  /**
   * This function will render the filter form. It optionally takes a group
   * object to prefill the form with the device group specific data.
   */
  getFilterComponent(newFilterFlag, formChanged, group) {
    let operatorOptions = [
      {
        value: 'EQ',
        label: Config.STATUS_CODES.EQ
      },
      {
        value: 'GT',
        label: Config.STATUS_CODES.GT
      },
      {
        value: 'LT',
        label: Config.STATUS_CODES.LT
      },
      {
        value: 'GE',
        label: Config.STATUS_CODES.GT
      },
      {
        value: 'LE',
        label: Config.STATUS_CODES.LE
      },
      {
        value: '[]',
        label: Config.STATUS_CODES.BRACKET
      },
      {
        value: '[',
        label: Config.STATUS_CODES.OPENBRACKET
      },
      {
        value: ']',
        label: Config.STATUS_CODES.CLOSEBRACKET
      }
    ];

    let fieldOptions = (this.state.allFields || []).map(field => ({
      value: field,
      label: field
    }));

    return (
      <div className="editable-filters">
        <div>
          <label>
            <div className="label-names">
              {lang.FILTER.FILTERNAME}
            </div>
            <input
              onChange={evt => {
                this.setEditingState(group.id, { formChanged: true });
                group.displayName = evt.target.value;
                if (group.displayName.trim() === '') {
                  this.setEditingState(group.id, { emptyName: true });
                }
              }}
              type="text"
              value={group && group.displayName}
              className="style-manage"
              placeholder={lang.FILTER.ENTERNAMEFORFILTER}
            />
          </label>
          {(this.state.editingState[group.id] || {}).emptyName
            ? <div className="error-msg">
                {lang.FILTER.FILTERNAMECANNOTBEEMPTY}
              </div>
            : null}
        </div>
        <div className="conditions-wrapper">
          {(group.conditions || []).map((cond, idx) => {
            return (
              <div key={idx}>
                <div>
                  <label>
                    <div className="label-names">
                      {lang.FILTER.FIELD}
                    </div>
                    <Select
                      autofocus
                      options={fieldOptions}
                      value={cond.key}
                      onChange={value => {
                        this.setEditingState(group.id, { formChanged: true });
                        cond.key = value;
                      }}
                      simpleValue
                      searchable={true}
                      placeholder={lang.FILTER.ENTERREPORTED}
                      className="selectStyle-manage"
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <div className="label-names">
                      {lang.FILTER.OPERATOR}
                    </div>
                    <div>
                      <Select
                        autofocus
                        options={operatorOptions}
                        value={cond.operator}
                        onChange={value => {
                          this.setEditingState(group.id, { formChanged: true });
                          cond.operator = value;
                        }}
                        simpleValue
                        searchable={true}
                        placeholder={lang.FILTER.EQUALS}
                        className="selectStyle-manage"
                      />
                    </div>
                  </label>
                </div>
                <div>
                  <label>
                    <div className="label-names">
                      {lang.FILTER.VALUE}
                    </div>
                    <input
                      onChange={evt => {
                        this.setEditingState(group.id, { formChanged: true });
                        cond.value = evt.target.value;
                        if (cond.value.trim() === '') {
                          this.setEditingState(group.id, { emptyValue: true });
                        }
                      }}
                      type="text"
                      value={cond.value}
                      placeholder={lang.FILTER.ENTERFILTERVALUE}
                      className="style-manage"
                    />
                  </label>

                  {(this.state.editingState[group.id] || {}).emptyValue
                    ? <div className="error-msg">
                        {lang.FILTER.VALUECANNOTBEEMPTY}
                      </div>
                    : null}
                </div>
                <button
                  onClick={() => {
                    group.conditions.splice(idx, 1);
                    this.setEditingState(group.id, { formChanged: true });
                  }}
                  type="button"
                  className="add-condition"
                >
                  <img src={Remove} alt={`${Remove}`} className="Remove-icon" />
                  {lang.FILTER.REMOVECONDITIONS}
                </button>
              </div>
            );
          })}
          <button
            onClick={() => {
              group.conditions.push({
                key: '',
                operator: 'EQ',
                value: ''
              });
              this.setState({});
            }}
            type="button"
            className="add-condition"
          >
            <img src={Add} height="12" alt={`${Add}`} className="add-icon" />
            {lang.FILTER.ADDCONDITIONS}
          </button>
        </div>
        <div className="buttons-group">
          <div className="save-delete-cancel-buttons">
            <button
              onClick={() => {
                this.props.saveOrUpdateFilter(formChanged, group);
                this.setEditingState(group.id, { showEdit: false });
              }}
              className={newFilterFlag ? 'save' : 'delete-filter'}
            >
              <img
                src={newFilterFlag ? Apply : formChanged ? Apply : Trash}
                height="10"
                alt={newFilterFlag ? `${Apply}` : `${Trash}`}
                className="apply-icon"
              />
              {newFilterFlag ? 'Save' : formChanged ? 'Save' : 'Delete Filter'}
            </button>
            <button
              onClick={() => {
                this.setEditingState(group.id, { showEdit: false });
                if (group.id !== 0) {
                  this.restoreFilter(group.id);
                } else {
                  this.setState({
                    showCreateFilter: false
                  });
                }
              }}
              className="cancel-button"
            >
              <img src={CancelX} alt={`${CancelX}`} className="cancel-icon" />
              {lang.FILTER.CANCEL}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * On this component state, we maintain a editingState object for each device groupId
   * that contains a boolean called 'showEdit' to control the hiding/showing of
   * the filter
   */
  setEditingState(groupId, newState) {
    const prevEditingState = this.state.editingState;
    const tempEditingState = {
      ...prevEditingState
    };
    tempEditingState[groupId] = tempEditingState[groupId] || {};
    tempEditingState[groupId] = {
      ...tempEditingState[groupId],
      ...newState
    };
    this.setState({
      editingState: tempEditingState
    });
  }

  render() {
    const { content } = this.props;
    const { showCreateFilter, editingState } = this.state;
    const deviceGroups = content.deviceGroups || [];
    const newGroupObj = deviceGroups[0];
    return (
      <div className="manage-filter-container">
        <div
          onClick={() => this.setState({ showCreateFilter: true })}
          className="create-filter"
        >
          <img src={Add} height="12" alt={`${Add}`} className="add-icon" />
          {lang.FILTER.CREATEFILTER}
        </div>
        {showCreateFilter
          ? this.getFilterComponent(
              true,
              editingState[0] && editingState[0].formChanged,
              newGroupObj
            )
          : null}
        <div className="headers-for-deviceGroups">
          <span className="filters-text">
            {lang.FILTER.FILTERS}
          </span>
          <span className="actions">
            {lang.FILTER.ACTIONS}
          </span>
        </div>
        <div>
          {deviceGroups.map((group, idx) => {
            const currentEditingState = editingState[group.id] || {};
            if (group.id === 0) {
              return null;
            }
            return (
              <div key={group.id}>
                <div className="groupname-icons">
                  {group.displayName}
                  <span
                    onClick={() =>
                      this.setEditingState(group.id, { showEdit: true })}
                    className="edit-delete-icons"
                  >
                    <span
                      onClick={() =>
                        this.setEditingState(group.id, { showEdit: true })}
                    >
                      <img
                        src={EditPencil}
                        height="12"
                        alt={`${EditPencil}`}
                        className="edit-icon"
                      />
                    </span>
                    <span>
                      <img
                        src={Trash}
                        height="12"
                        alt={`${Trash}`}
                        className="delete-icon"
                      />
                    </span>
                  </span>
                </div>
                {currentEditingState.showEdit
                  ? this.getFilterComponent(
                      false,
                      currentEditingState.formChanged,
                      group
                    )
                  : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  saveOrUpdateFilter: (formChanged, group) => {
    if (formChanged || group.id === 0) {
      dispatch(saveOrUpdateFilter(group));
    } else {
      dispatch(deleteFilter(group));
    }
  }
});

export default connect(null, mapDispatchToProps)(ManageFiltersFlyout);
