/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, {Component} from 'react';
import DatePicker from "react-bootstrap-date-picker";
import { JSONHelper } from '../../../helpers/jsonHelper';
import { ApiHelper } from '../../../helpers/apiHelper';
import utility from '../../../utility';
class ProgrammeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      programs: [],
      workflows: [],
      states: [],
      enrolledOnOrAfter: '',
      enrolledOnOrBefore: '',
      completedOnOrAfter: '',
      completedOnOrBefore: '',
      inStartDate: '',
      inEndDate: '',
      state: '',
      program: '',
      workflow: ''
    };
    this.searchByProgram = this.searchByProgram.bind(this);
    this.handleSelectProgram = this.handleSelectProgram.bind(this);
    this.handleSelectState = this.handleSelectState.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.getDateString = this.getDateString.bind(this);
    this.handleWorkflowChange = this.handleWorkflowChange.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.resetDates = this.resetDates.bind(this);
  }

  // Make a call to the program endpoint to get backend field data when component mounts
  componentDidMount(props) {
    this.props.fetchData('/program').then(data => {
      this.setState({
        programs: data.results
      });
    });
  }

    /**
     * Method to handle Search by programs events/actions
     * @param {Object} event - Object containing data about this event
     * @return {undefined} - returns undefined
     */
  searchByProgram(event) {
    event.preventDefault();
    const jsonHelper = new JSONHelper();
    const jsonQuery = jsonHelper.composeJson(this.createSearchByProgramParmeters());
    // generate custom search query and search label

    //if the user selects the "in the program field" but the user didn't choose a state
    if((this.state.inStartDate || this.state.inEndDate) && !this.state.state) {
      const initialNumberOfFilters = jsonQuery.query.rowFilters.length;
      jsonQuery.query.rowFilters.push(
        {
          "type": "org.openmrs.module.reporting.cohort.definition.PatientDataDefinition",
          "key": "reporting.library.cohortDefinition.builtIn.patientsWithEnrollment",
          "parameterValues": {
            "enrolledOnOrBefore":this.state.inStartDate || this.state.inEndDate
          }
        }
      );

      jsonQuery.query.rowFilters.push(
        {
          "type": "org.openmrs.module.reporting.cohort.definition.PatientDataDefinition",
          "key": "reporting.library.cohortDefinition.builtIn.patientsWithEnrollment",
          "parameterValues": {
            "completedOnOrBefore":this.state.inEndDate || this.state.inStartDate
          }
        }
      );

      jsonQuery.query.customRowFilterCombination = (initialNumberOfFilters === 1) ? '(1 and 2) and not 3' : '(1 and 2 and 3) and not 4';          
    } else if((this.state.inStartDate || this.state.inEndDate) && this.state.state) {
            // if the user selects a state and also specified the "in the programme field"
            // then the patientsInState library key will have to be used
      const initialNumberOfFilters = jsonQuery.query.rowFilters.length;
      let parameterValues;
      if(this.state.inStartDate && this.state.inEndDate) {
        parameterValues = {
          onOrAfter: this.state.inStartDate,
          onOrBefore: this.state.inEndDate
        };
      } else if (this.state.inStartDate && !this.state.inEndDate) {
        parameterValues = {
          onOrAfter: this.state.inStartDate
        };
      } else {
        parameterValues = {
          onOrBefore: this.state.inEndDate
        };
      }
      jsonQuery.query.rowFilters.push(
        {
          "type": "org.openmrs.module.reporting.cohort.definition.PatientDataDefinition",
          "key": "reporting.library.cohortDefinition.builtIn.patientsInState",
          parameterValues
        }
            );

      jsonQuery.query.customRowFilterCombination = (initialNumberOfFilters === 1) ? '1 and 2' : '1 and 2 and 3';
    }
    new ApiHelper().post('reportingrest/adhocquery?v=full', jsonQuery.query).then(res => {
      const label = this.composeLabel();
      if (JSON.stringify(res.rows) === JSON.stringify([])) {
        utility.notifications('info', 'Search completed successfully but no results found');
      } else {
        utility.notifications('success', 'Search completed successfully');
      }
      this.props.addToHistory(label, res.rows, jsonQuery.query);
      this.props.getHistory(res, label);
    }).catch(() => utility.notifications('error', 'Search error, check the server log for details.'));
  }

  /**
   * Helper method to get the Name of the selectedState using it's uuid
   * @return {String} Name of the selected state
   */
  getSelectedStateName() {
    return this.state.states
            .find(state => state.uuid === this.state.state)
            .concept.display;
  }

  /**
   * Helper method to get the name of the selectedProgram using it's uuid
   * @return {String} Name of the selected program
   */
  getSelectedProgramName() {
    return this.state.programs
            .find(element => element.uuid === this.state.program).name;
  }

  /**
   * Helper method to get the name of the selectedWorkflow for it's uuid
   * @return {String} Name of the selected program
   */
  getSelectedWorkflowName() {
    return this.state.workflows
            .find(workflow => workflow.uuid === this.state.workflow)
            .concept.display;
  }

  /**
   * Helper Method to compose a description for any programme enrollment
   * search.
   * @return {undefined} - Descriptive label for this search request
   */
  composeLabel() {
    let program = this.state.program;
    program =  !program ? 
            'all programs' : 
            this.getSelectedProgramName();
        
    let label = `Patients in ${program}`;
    if (this.state.workflow && this.state.state) {
      label += ` with workflow of ${this.getSelectedWorkflowName()}`;
      label += ` and state of ${this.getSelectedStateName()}`;
    }

    if (this.state.inEndDate || this.state.inStartDate) {
      label += this.composerHelper('inStartDate', 'inEndDate', 'were in');
    }

    if (this.state.enrolledOnOrBefore || this.state.enrolledOnOrAfter) {
      label += this.composerHelper('enrolledOnOrAfter', 'enrolledOnOrBefore', 'enrolled in');
    }

    if (this.state.completedOnOrBefore || this.state.completedOnOrAfter) {
      label += this.composerHelper('completedOnOrAfter', 'completedOnOrBefore', 'completed');
    }

    return label;
  }

  /**
   * Helper function to compose a repeating part of different searches label
   * @param {String} startProperty 
   * @param {String} endProperty 
   * @param {String} inLabel 
   * @return {String} - part of the label
   */
  composerHelper(startProperty, endProperty, inLabel) {
    let label = ` and ${inLabel} it`;
    if (this.state[startProperty] && this.state[endProperty]) {
      label += ` between ${this.state[startProperty]} & ${this.state[endProperty]}`;
    } else if (this.state[endProperty])  {
      label += ` before ${this.state[endProperty]}`;
    } else {
      label += ` after ${this.state[startProperty]}`;
    }  
    return label; 
  }

  /**
   * Method to handle events fired when a program is selected.
   * It passes the selected program to the getWorkflow method
   * @param {Object} event - Event Object containing data about this event
   * @return {undefined} - return undefined
   */
  handleSelectProgram(event) {
    event.preventDefault();
    const program = event.target.value;
    this.setState({
      program, states: [], workflows: [], state: '', workflow: ''
    });
    this.getWorkflow(program);
  }

  /**
   * Method handles what happened when the workflow field is changed.
   * It passes the selected workflow to the states associated with it
   * @param {Object} event - Event Object containing data about this event
   * @return {undefined} - return undefined
   */
  handleWorkflowChange(event) {
    event.preventDefault();
    const workflow = event.target.value;
    this.setState({ workflow });
    this.getStates(workflow);
  }

  /**
   * Method to handle selected state for the search
   * @param {Object} event - Event object containing data about this event
   * @return {undefined} - returns undefined
   */
  handleSelectState(event) {
    event.preventDefault();
    const state = event.target.value;
    this.setState({ state });
  }

  /**
   * Method to create necessary structured object containing parameters for 
   * a Program based search
   * @return {Object} - Object holding necessary parameters for the search
   */
  createSearchByProgramParmeters() {
        // if a program is selected, then the patientsWithEnrollment library key should be used
    const libraryKey = (this.state.state) ? 'patientsWithState' : 'patientsWithEnrollment';
    const parameters = {};
    parameters[libraryKey] = [];

    if (this.state.program && !this.state.state) {
      parameters[libraryKey].push({
        name: 'programs',
        type: 'program',
        value: [this.state.program]
      });
    }
    const fieldsValues = ['state', 'enrolledOnOrAfter', 'enrolledOnOrBefore', 'completedOnOrAfter', 'completedOnOrBefore'];
    fieldsValues.forEach(aField => {
      if (this.state[aField]) {
        let fieldName = (aField === 'state') ? 'states' : aField;
        let theFieldValue = (aField === 'state') ? [this.state[aField]] : this.state[aField];
        if (libraryKey === 'patientsWithState') {
                    // patientsWithState uses different parameter names
          switch(fieldName) {
            case 'enrolledOnOrAfter': fieldName = 'startedOnOrAfter'; break;
            case 'enrolledOnOrBefore': fieldName = 'startedOnOrBefore'; break;
            case 'completedOnOrAfter': fieldName = 'endedOnOrAfter'; break;
            case 'completedOnOrBefore': fieldName = 'endedOnOrBefore'; break;
          }
        }
        parameters[libraryKey].push({
          name: fieldName,
          value: theFieldValue
        });
      }
    });
    return parameters;
  }

  // Get program workflows for the program selected
  getWorkflow(program) {
    if (program) {
      this.props.fetchData(`/program/${program}`).then(data => {
        this.setState({
          workflows: data.allWorkflows
        });
      });
    } else {
      this.setState({ workflows: [], workflow: '' });
    }
  }
  // Get the states from the workflow.
  getStates(workflow) {
        /** Update state based on the data retrieved from the workflows
         * @TODO: State data does not exist on the local, but exists on refapp,
         * try to populate states on the local
        */
    if (workflow) {
      this.props.fetchData(`/workflow/${workflow}`).then(data => {
        this.setState({
          states: data.states
        });
      });
    } else {
      this.setState({ states: [], state: '' });
    }
  }

  /**
   * Method to get the date in the format MM-DD-YY from a date isoString
   * @param {String} isoString - Date in isoString format
   * @return {String} MM-DD-YY date formatted string
   */
  getDateString(isoString) {
    return isoString ? isoString.split('T')[0]: '';
  }


  /**
   * Method to update the date key for different date types in the state
   * @param {String} stateKey - The key in the component state that should be
   * updated
   * @return {Function} - Call back function to be executed by the date input
   * field
   */
  handleDateChange(dateType) {
    return value => this.setState({
      [dateType]: this.getDateString(value)
    });
  }

  /**
   * Method to reset all input fields in this components form
   * @return {undefined}
   */
  resetFields() {
    this.resetDates();
    this.setState({
      state: '',
      workflow: '',
      program: ''
    });
  }

  /**
   * Method to reset all date in this component state
   * @return {undefined}
   */
  resetDates() {
    this.setState({
      enrolledOnOrAfter: '',
      enrolledOnOrBefore: '',
      completedOnOrAfter: '',
      completedOnOrBefore: '',
      inStartDate: '',
      inEndDate: '',
    });
  }


  render() {
    let programs = this.state.programs.map((program) => {
      return (
        <option key={program.uuid} value={program.uuid} id={program.uuid}>
            {program.name}
        </option>
      );
    });
    let workflows = this.state.workflows.map((workflow) => {
      return (
        <option key={workflow.uuid} value={workflow.uuid}>
            {workflow.concept.display}
        </option>
      );  
    });
    
    // States will be loaded from this.state.states when populated from backend
    let states = this.state.states.map((theState) => {
      return (
        <option key={theState.uuid} value={theState.uuid} id={theState.uuid}>
            {theState.concept.display}
        </option>
      );  
    });

    return (
        <div className="programme-component">
          <h3>Search By Program Enrollement and Status</h3>
          <form className="form-horizontal" onSubmit={this.searchByProgram}>
              <div className="form-group">
                  <label htmlFor="gender" className="col-sm-2 control-label">Program:</label>
                  <div className="col-sm-6">
                      <select
                          onChange={this.handleSelectProgram}
                          value={this.state.program}
                          className="form-control"
                          id="program"
                          name="program"
                      >
                          <option value="">All</option>
                          { programs }
                      </select>
                  </div>
              </div>

              <div className="form-group">
                  <label htmlFor="gender" className="col-sm-2 control-label">Workflow:</label>
                  <div className="col-sm-6">
                      <select
                          className="form-control" 
                          id="workflow"
                          onChange={this.handleWorkflowChange}
                          value={this.state.workflow}
                      >
                          <option value="">All</option>
                          { workflows }
                      </select>
                  </div>
              </div>

              <div className="form-group">
                  <label htmlFor="gender" className="col-sm-2 control-label">State:</label>
                  <div className="col-sm-6">
                      <select
                          className="form-control"
                          id="state"
                          onChange={this.handleSelectState}
                          value={this.state.state}
                      >
                          <option value="">All</option>
                          { states }
                      </select>
                  </div>
              </div>

              <div className="form-group">
                  <label className="col-sm-2 control-label">In the programme</label>
                  
                  <div className="col-sm-1">
                        <span className="inline-label">On or after:</span>
                  </div>
                  <div className="col-sm-3">
                      <DatePicker
                          className="form-control"
                          name="from-date"
                          id="inStartDate"
                          dateFormat="DD-MM-YYYY"
                          value={this.state.inStartDate}
                          onChange={this.handleDateChange('inStartDate')}
                      />
                  </div>
                  <span className="inline-label">On or before:</span>
                  <div className="col-sm-3">
                      <DatePicker
                          className="form-control"
                          name="to-date"
                          id="inEndDate"
                          dateFormat="DD-MM-YYYY"
                          value={this.state.inEndDate}
                          onChange={this.handleDateChange('inEndDate')}
                      />
                  </div>
              </div>

              <div className="form-group">
                  <label className="col-sm-2 control-label">Enrolled in the programme</label>
                  
                  <div className="col-sm-1">
                        <span className="inline-label">On or after:</span>
                  </div>
                  <div className="col-sm-3">
                      <DatePicker
                          id="enrolledOnOrAfter"
                          className="form-control"
                          name="from-date"
                          dateFormat="DD-MM-YYYY"
                          value={this.state.enrolledOnOrAfter}
                          onChange={this.handleDateChange('enrolledOnOrAfter')}
                      />
                  </div>
                  <span className="inline-label">On or before:</span>
                  <div className="col-sm-3">
                      <DatePicker
                          id="enrolledOnOrBefore"
                          className="form-control"
                          name="to-date"
                          dateFormat="DD-MM-YYYY"
                          value={this.state.enrolledOnOrBefore}
                          onChange={this.handleDateChange('enrolledOnOrBefore')}
                      />
                  </div>
              </div>

              <div className="form-group">
                  <label className="col-sm-2 control-label">Completed the programme</label>
                  
                  <div className="col-sm-1">
                        <span className="inline-label">On or after:</span>
                  </div>
                  <div className="col-sm-3">
                      <DatePicker
                          id="completedOnOrAfter"
                          className="form-control"
                          name="from-date"
                          dateFormat="DD-MM-YYYY"
                          value={this.state.completedOnOrAfter}
                          onChange={this.handleDateChange('completedOnOrAfter')}
                      />
                  </div>
                  <span className="inline-label">On or before:</span>
                  <div className="col-sm-3">
                      <DatePicker
                          id="completedOnOrBefore"
                          className="form-control"
                          name="to-date"
                          dateFormat="DD-MM-YYYY"
                          value={this.state.completedOnOrBefore}
                          onChange={this.handleDateChange('completedOnOrBefore')}
                      />
                  </div>
              </div>
              
              <div className="form-group">
                  <div className="col-sm-offset-2 col-sm-6">
                      <button type="submit" className="btn btn-success">Search</button>
                      <button type="reset" onClick={this.resetFields} className="btn btn-default cancelBtn">Reset</button>
                  </div>
              </div>
          </form>
        </div>
    );
  }
}

ProgrammeComponent.propTypes = {
  fetchData: React.PropTypes.func.isRequired,
  search: React.PropTypes.func.isRequired,
  addToHistory: React.PropTypes.func.isRequired,
  getHistory: React.PropTypes.func.isRequired
};

export default ProgrammeComponent;
