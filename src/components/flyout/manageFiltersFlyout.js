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
import Spinner from '../spinner/spinner';
import lang from '../../common/lang';
import { typeComputation } from '../../common/utils';

import './manageFilterFlyout.css';

import { saveOrUpdateFilter, deleteFilter } from '../../actions/manageFiltersFlyoutActions';

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
    this.typeFieldComputation();
  }

  componentWillReceiveProps(nextProps) {
    setTimeout(() => {
      this.saveDeviceGroups();
      this.processFieldValues();
      this.processOperatorValues();
      this.typeFieldComputation();
    });
  }

  saveDeviceGroups() {
    const { content } = this.props;
    const deviceGroups = content.deviceGroups || [];
    this.oldDeviceGroups = JSON.parse(JSON.stringify(deviceGroups));
    const newGroupObj = {
      Id: 0,
      DisplayName: '',
      Conditions: [
        {
          Key: 'tags.region',
          Operator: 'EQ',
          Value: ''
        }
      ]
    };
    this.props.content.deviceGroups = [newGroupObj, ...deviceGroups];
    const editingState = this.state.editingState;
    this.props.content.deviceGroups.forEach(group => {
      if (!editingState[group.Id]) {
        editingState[group.Id] = {};
      }
      editingState[group.Id].showEdit = false;
      editingState[group.Id].saveInProgress = false;
    });
  }

  processFieldValues() {
    const { content } = this.props;
    const deviceGroups = content.deviceGroups || [];
    const fields = [];
    deviceGroups.forEach(group => {
      if (!group.Conditions) {
        return;
      }
      group.Conditions.forEach(cond => {
        if (fields.indexOf(cond.Key) === -1) {
          fields.push(cond.Key);
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
      if (!group.Conditions) {
        return;
      }
      group.Conditions.forEach(cond => {
        if (operators.indexOf(cond.Operator) === -1) {
          operators.push(cond.Operator);
        }
      });
    });
    this.setState({
      allOperators: operators
    });
  }

  typeFieldComputation() {
    const { content } = this.props;
    const deviceGroups = content.deviceGroups || [];
    if (!deviceGroups) return;
    deviceGroups.forEach(group => {
      if (!group.Conditions) return;
      group.Conditions.forEach(typeComputation);
    });
  }

  restoreFilter(groupId) {
    const oldDeviceGroups = this.oldDeviceGroups;
    const { content } = this.props;
    const deviceGroups = content.deviceGroups || [];
    if (!deviceGroups) return;
    deviceGroups.forEach(group => {
      if (group.Id === groupId) {
        oldDeviceGroups.forEach(oldGroup => {
          if (oldGroup.Id === groupId) {
            group.DisplayName = oldGroup.DisplayName;
            group.Conditions = oldGroup.Conditions;
          }
        });
      }
    });
  }

  checkIfGroupNameExists(groupName, groupId) {
    const { content } = this.props;
    const deviceGroups = content.deviceGroups || [];
    return (
      deviceGroups.length > 0 && deviceGroups.some(group => group.DisplayName === groupName && group.Id !== groupId)
    );
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
    let typeOptions = [
      {
        value: 'int',
        label: Config.STATUS_CODES.INT
      },
      {
        value: 'string',
        label: Config.STATUS_CODES.STRING
      }
    ];

    // TODO: Remove these when the PCS Config provides these filed values
    let fieldOptions = [
      {
        value: 'tags.IsSimulated',
        label: Config.STATUS_CODES.IS_SIMULATED
      },
      {
        value: 'tags.Region',
        label: Config.STATUS_CODES.REGION
      },
      {
        value: 'tags.Floor',
        label: Config.STATUS_CODES.FLOOR
      },
      {
        value: 'tags.Building',
        label: Config.STATUS_CODES.BUILDING
      },
      {
        value: 'tags.country',
        label: Config.STATUS_CODES.COUNTRY
      },
      {
        value: 'tags.test',
        label: Config.STATUS_CODES.TEST
      },
      {
        value: 'Properties.Reported.Type',
        label: Config.STATUS_CODES.REPORTED_TYPE
      },
      {
        value: 'Properties.Reported.Location',
        label: Config.STATUS_CODES.REPORTED_LOCATION
      }
    ];

    return (
      <div className="editable-filters">
        <div>
          <label>
            <div className="label-names">
              {lang.FILTER.FILTERNAME}
            </div>
            <input
              onChange={evt => {
                group.DisplayName = evt.target.value || '';
                const editingState = {
                  formChanged: true
                };
                editingState.isDuplicate = this.checkIfGroupNameExists(group.DisplayName, group.Id);
                editingState.emptyName = group.DisplayName.trim() === '';
                this.setEditingState(group.Id, editingState);
              }}
              type="text"
              value={group && group.DisplayName}
              className="style-manage"
              placeholder={lang.FILTER.ENTERNAMEFORFILTER}
            />
          </label>
          {(this.state.editingState[group.Id] || {}).isDuplicate
            ? <div className="error-msg">
                {lang.FILTER.GROUPNAMEALREADYEXISTS}
              </div>
            : null}
          {(this.state.editingState[group.Id] || {}).emptyName
            ? <div className="error-msg">
                {lang.FILTER.FILTERNAMECANNOTBEEMPTY}
              </div>
            : null}
        </div>
        <div className="conditions-wrapper">
          {(group.Conditions || []).map((cond, idx) => {
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
                      value={cond.Key}
                      onChange={value => {
                        this.setEditingState(group.Id, { formChanged: true });
                        cond.Key = value;
                      }}
                      simpleValue
                      searchable={true}
                      placeholder={lang.FILTER.ENTERREPORTED}
                      className="select-style-manage"
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
                        value={cond.Operator}
                        onChange={value => {
                          this.setEditingState(group.Id, { formChanged: true });
                          cond.Operator = value;
                        }}
                        simpleValue
                        searchable={true}
                        placeholder={lang.FILTER.EQUALS}
                        className="select-style-manage"
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
                        const editingState = {
                          formChanged: true,
                          valuesEditingState: {}
                        };
                        cond.Value = evt.target.value || '';
                        editingState.valuesEditingState[idx] = {
                          emptyValue: cond.Value.trim() === ''
                        };
                        this.setEditingState(group.Id, editingState);
                      }}
                      type="text"
                      value={cond.Value}
                      placeholder={lang.FILTER.ENTERFILTERVALUE}
                      className="style-manage"
                    />
                  </label>

                  {this.checkIfConditionValueIsEmpty(group.Id, idx)
                    ? <div className="error-msg">
                        {lang.FILTER.VALUECANNOTBEEMPTY}
                      </div>
                    : null}
                </div>
                <div>
                  <label>
                    <div className="label-names">
                      {lang.FILTER.TYPE}
                    </div>
                    <Select
                      autofocus
                      options={typeOptions}
                      onChange={type => {
                        cond.type = type;
                        this.setEditingState(group.Id, { formChanged: true });
                      }}
                      value={cond.type}
                      simpleValue
                      searchable={true}
                      placeholder={lang.FILTER.TYPE}
                      className="select-style-manage"
                    />
                  </label>
                </div>
                <button
                  onClick={() => {
                    group.Conditions.splice(idx, 1);
                    this.setEditingState(group.Id, { formChanged: true });
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
              group.Conditions.push({
                Key: '',
                Operator: 'EQ',
                Value: ''
              });
              this.setState({}); 
            }}
            type="button"
            className="add-condition"
          >
            <img src={Add} alt={`${Add}`} className="add-icon" />
            {lang.FILTER.ADDCONDITIONS}
          </button>
        </div>
        <div className="buttons-group">
          <div className="save-delete-cancel-buttons">
            {(this.state.editingState[group.Id] || {}).saveInProgress
              ? <span className="loading-spinner">
                  <Spinner />
                </span>
              : null}
            <button
              onClick={() => {
                const editingState = this.state.editingState[group.Id] || {};
                if (editingState.emptyName || editingState.isDuplicate || !group.DisplayName) {
                  //do not save
                  return;
                }
                if (group.Conditions.some(cond => !cond.Value)) {
                  return;
                }
                this.setEditingState(group.Id, { saveInProgress: true });
                this.props.saveOrUpdateFilter(formChanged, group);
              }}
              className={newFilterFlag ? 'save' : 'delete-filter'}
            >
              <img
                src={newFilterFlag ? Apply : formChanged ? Apply : Trash}
                alt={newFilterFlag ? `${Apply}` : `${Trash}`}
                className="apply-icon"
              />
              {newFilterFlag ? 'Save' : formChanged ? 'Save' : 'Delete Filter'}
            </button>
            <button
              onClick={() => {
                this.setEditingState(group.Id, {
                  showEdit: false,
                  formChanged: false
                });
                if (group.Id !== 0) {
                  this.restoreFilter(group.Id);
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

  checkIfConditionValueIsEmpty(groupId, idx) {
    const editingState = this.state.editingState[groupId] || {};
    const valuesEditingState = (editingState.valuesEditingState || {})[idx] || {};
    return valuesEditingState.emptyValue;
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
    let tempValuesEditingState = {};
    if (tempEditingState[groupId].valuesEditingState) {
      tempValuesEditingState = tempEditingState[groupId].valuesEditingState;
      tempValuesEditingState = {
        ...tempValuesEditingState,
        ...newState.valuesEditingState
      };
    }
    tempEditingState[groupId] = {
      ...tempEditingState[groupId],
      ...newState,
      valuesEditingState: tempValuesEditingState
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
        <div onClick={() => this.setState({ showCreateFilter: true })} className="create-filter">
          <img src={Add} alt={`${Add}`} className="add-icon" />
          {lang.FILTER.CREATEFILTER}
        </div>
        {showCreateFilter
          ? this.getFilterComponent(true, editingState[0] && editingState[0].formChanged, newGroupObj)
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
            const currentEditingState = editingState[group.Id] || {};
            if (group.Id === 0) {
              return null;
            }
            return (
              <div key={group.Id}>
                <div className="groupname-icons">
                  {group.DisplayName}
                  <span
                    onClick={() => this.setEditingState(group.Id, { showEdit: true })}
                    className="edit-delete-icons"
                  >
                    <span onClick={() => this.setEditingState(group.Id, { showEdit: true })}>
                      <img src={EditPencil} alt={`${EditPencil}`} className="edit-icon" />
                    </span>
                    <span>
                      <img src={Trash} alt={`${Trash}`} className="delete-icon" />
                    </span>
                  </span>
                </div>
                {currentEditingState.showEdit
                  ? this.getFilterComponent(false, currentEditingState.formChanged, group)
                  : null}
              </div>
            );
          })}
        </div>
        <div className="flyout-footer">
          <div onClick={this.props.onClose}>Cancel</div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  saveOrUpdateFilter: (formChanged, group) => {
    if (formChanged || group.Id === 0) {
      dispatch(saveOrUpdateFilter(group));
    } else {
      dispatch(deleteFilter(group));
    }
  }
});

const mapStateToProps = state => ({
  deviceGroups: state.filterReducer.deviceGroups
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageFiltersFlyout);
