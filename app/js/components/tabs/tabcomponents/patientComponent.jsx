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
import shortId from 'shortid';
import DatePicker from "react-bootstrap-date-picker";
import { Creatable } from 'react-select';
import utility from '../../../utility';
import { JSONHelper } from '../../../helpers/jsonHelper';

class PatientComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientAttributes: [],
      searchResults: [],
      currentPage: 1,
      toDisplay: [],
      totalPage: 0,
      perPage: 10,
      livingStatus: '',
      description: '',
      startDate: '',
      endDate: '',
      selectedAttributeValues: [],
      selectedAttribute: '',
      gender: 'all',
      minAge: '',
      maxAge: '',
      ageErrorObject: {
        status: false,
        minAgeErrorMsg: '',
        maxAgeErrorMsg: '',
      },
    };
    this.jsonHelper = new JSONHelper();
    this.searchDemographics = this.searchDemographics.bind(this);
    this.navigatePage = this.navigatePage.bind(this);
    this.searchByAttributes = this.searchByAttributes.bind(this);
    this.toggleLivingStatus = this.toggleLivingStatus.bind(this);
    this.getDateString = this.getDateString.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.resetSearchByDemographics = this.resetSearchByDemographics.bind(this);
    this.resetSearchByAttributes = this.resetSearchByAttributes.bind(this);
    this.handleAddAttributeValue = this.handleAddAttributeValue.bind(this);
    this.handleSelectAttribute = this.handleSelectAttribute.bind(this);
    this.handleSelectGender = this.handleSelectGender.bind(this);
    this.handleSelectAge = this.handleSelectAge.bind(this);
    this.handleValidateAgeInput = this.handleValidateAgeInput.bind(this);
    this.isAgeValid = this.isAgeValid.bind(this);
  }

  componentDidMount(props) {
    this.props.fetchData('/personattributetype').then(data => {
      this.setState({
        patientAttributes: data.results
      });
    });
  }

  searchDemographics(event) {
    event.preventDefault();
    const { gender, livingStatus } = this.state;
    let { startDate, endDate, minAge, maxAge } = this.state;
    const searchParameters = { gender };

    // add appropriate age constraints to the search parameters
    if (minAge && maxAge) {
      // switch the min and max ages if the min age is greater than the max age
      if (parseInt(minAge) > parseInt(maxAge)) {
        const minAgeStore = minAge;
        minAge = maxAge;
        maxAge = minAgeStore;
      }
  
      searchParameters.ageRangeOnDate = [
        { name: 'minAge', value: minAge },
        { name: 'maxAge', value: maxAge}
      ];
    } else {
      if (minAge) {
        searchParameters.atLeastAgeOnDate = [
          { name: 'minAge', value: minAge }
        ];
      } else {
        searchParameters.upToAgeOnDate = [
          { name: 'maxAge', value: maxAge }
        ];
      }
    }
    // add appropriate birthdate constraints to the search parameters
    if (startDate && endDate) {
      // coerce the values of start date and end date to numbers for comparison    
      let startYear = Number(startDate.split('-')[0]);
      let endYear = Number(endDate.split('-')[0]);

      // switch the start and end dates if the start year is before the end year
      if (startYear > endYear) {
        const startDateStore = startDate;
        startDate = endDate;
        endDate = startDateStore;
      }

      searchParameters.bornDuringPeriod = [
        { name: 'startDate', dataType: 'date', value: startDate },
        { name: 'endDate', dataType: 'date', value: endDate }
      ];
    }

    // for dead people, diedDuring period -> endDate === now
    // for living people, diedDuring period -> endDate !== now
    const today = new Date();
    const dayFormat = this.getDateString(today.toISOString());
    
    if (livingStatus === 'alive' || livingStatus === 'dead') {
      searchParameters.diedDuringPeriod = [
        { name: 'endDate', dataType: 'date', value: dayFormat, livingStatus }
      ];
    }

    // check that there is a valid date range before performing search
    if (!(startDate && !endDate || endDate && !startDate)) {
      this.performSearch(
        searchParameters, this.getSearchByDemographicsDescription()
      );
    }
    this.resetSearchByDemographics();
  }

  /**
   * Mehtod to get the search by attributes description
   * @return {String} - Search by attributes description
   */
  getSearchByAttributesDescription() {
    let label = 'Patients';
    const uuid = this.state.selectedAttribute;
    const attributeLabel = uuid ?
      this.state.patientAttributes
      .find(attribute => attribute.uuid === uuid).display
      : ' with any attribute';

    const attributeValues = this.state.selectedAttributeValues.length > 0 ?
      this.state.selectedAttributeValues
      .map(attribute => attribute.label)
      .join(', ')
      .replace(/,(?=[^,]*$)/, ' or') : '';
    
    label += uuid ?
      ` with${attributeValues ? '' : ' any'} ${attributeLabel}` 
      : attributeLabel;
    
    label += attributeValues ? 
      ` equal to ${attributeValues.length > 1 && 'either'} ${attributeValues}`
      : '';
    return label;
  }

  /**
   * Method to get the demographic search description
   * @return {String} - Demographic search description
   */
  getSearchByDemographicsDescription() {
    const {
      gender, minAge, maxAge, startDate, endDate, livingStatus
    } = this.state;
    let label = gender != 'all' ?
      `${gender === 'males' ? 'Male' : 'Female'} Patients`
      : 'All Patients';
    if (minAge || maxAge) {
      if (minAge && maxAge) {
        label += ` with ages between ${minAge} and ${maxAge}`;
      } else {
        label += minAge ?
          ` with minimum age of ${minAge}` : ` with maximum age of ${maxAge}`;
      }
      label += ' years';
    }
    if (startDate || endDate) {
      if (startDate && endDate) {
        label += ` and birthdate between ${startDate} and ${endDate}`;
      } else {
        label += minAge ?
          `and born before ${startDate}` : `and born before ${endDate}`;
      }
    }
    if (livingStatus) {
      label += ` that are ${livingStatus}`;
    }
    return label;
  }

  performSearch(searchParameters, description) {
    const theParameter = Object.assign({}, searchParameters);
    const queryDetails = this.jsonHelper.composeJson(theParameter);
    // we want to append necessary rowFilters here if user selected all patients
    if (searchParameters.gender === 'all') {
      const tempRowFilter = ['males', 'females', 'unknownGender'].map(item => {
        return {
          type: "org.openmrs.module.reporting.dataset.definition.PatientDataSetDefinition",
          key: `reporting.library.cohortDefinition.builtIn.${item}`
        };
      });
      queryDetails.query.rowFilters = queryDetails.query.rowFilters.length > 0 ?
        [...queryDetails.query.rowFilters, ...tempRowFilter] : tempRowFilter;
      const filters = queryDetails.query.rowFilters;
      const filterCombination = queryDetails.query.customRowFilterCombination;
      queryDetails.query.customRowFilterCombination = filterCombination ?
        `(${filters.length - 2} OR ${filters.length - 1} OR ${filters.length}) AND ${filterCombination}`
        : '(1 OR 2 OR 3)';
    }
    this.props.search(queryDetails, description).then(results => {
      const allPatients = results.rows || [];
      if (JSON.stringify(allPatients) === JSON.stringify([])) {
        utility.notifications('info', 'Search completed successfully but no results found');
      } else {
        utility.notifications('success', 'Search completed successfully');
      }
      // adds the current search to search history
      this.props.addToHistory( description, allPatients, results.query );
    }).catch(() => utility.notifications('error', 'Search error, check the server log for details'));
  }

  /**
   * Method to perform a search by Patient attributes
   * @param {Object} Event Object 
   * @return {undefined}
   */
  searchByAttributes(event) {
    event.preventDefault();
    const searchParameters = {
      personWithAttribute: [
        {
          name: "attributeType",
          value: this.state.selectedAttribute
        },
        {
          name: "values",
          value: this.state.selectedAttributeValues.map(option => option.value)
        }
      ]
    };
    this.performSearch(
      searchParameters, this.getSearchByAttributesDescription()
    );
    this.resetSearchByAttributes();
  }

  navigatePage(event) {
    event.preventDefault();
    let pageToNavigate = 0;
    switch (event.target.value) {
      case 'first': pageToNavigate = 1; break;
      case 'last': pageToNavigate = this.state.totalPage; break;
      default: pageToNavigate = (event.target.value === 'next') ? this.state.currentPage + 1 : this.state.currentPage - 1;
    }
    const pagePatientInfo = this.getPatientDetailsPromises(this.state.searchResults, pageToNavigate);
    this.setState({ toDisplay: pagePatientInfo, currentPage: pageToNavigate });
  }

  getPatientDetailsPromises(allPatients, currentPage) {
    const pagePatientInfo = [];
    for (let index = (currentPage - 1) * this.state.perPage; index < currentPage * this.state.perPage && index < allPatients.length; index++) {
      pagePatientInfo.push(
        allPatients[index]
      );
    }
    return pagePatientInfo;
  }

  toggleLivingStatus(event) {
    this.setState({ livingStatus: event.target.value });
  }

  handleSelectGender(event) {
    this.setState({ gender: event.target.value });
  }

  /**
   * This method handles the validation of the user input, it ensure no age below 0
   * and above 200 can be use to filter the search. 
   * 
   * @param {interger} age This is the age the user inputs
   * @param {string} identifier This is the ID of the age 
   * @returns {boolean} determines if error messages are shown
   * @memberof PatientComponent
   */
  isAgeValid(age, identifier) {
    if (age >= 0 && age <= 200 && typeof(age)==="string" && parseInt(age + 1) && age !== '-0') {
      this.setState((previousState) => {
        previousState.ageErrorObject[`${identifier}ErrorMsg`] = '';
        return previousState;
      });
      return true;
    } else if(age < 0 || age === '-0' || age === -0) {
      this.setState((previousState) => {
        identifier === 'minAge' ?
          previousState.ageErrorObject.minAgeErrorMsg = 'The age must be greater than 0' : 
          previousState.ageErrorObject.maxAgeErrorMsg = 'The age must be greater than 0';
        return previousState;
      });
    } else if(age > 200) {
      this.setState((previousState) => {
        identifier === 'minAge' ?
          previousState.ageErrorObject.minAgeErrorMsg = 'The age must be less than 200' :
          previousState.ageErrorObject.maxAgeErrorMsg = 'The age must be less than 200';
        return previousState;
      });
    }
    return false;
  }

  /**
   * Extra validation for browsers Safari and other browsers
   * that did not implement restriction for type number
   * onKeyDown
   * @param {object} event
   */
  handleValidateAgeInput(event){
    if (typeof event.key === 'boolean' || isNaN(event.key)) {
      event.preventDefault();
    } 
  }

  /**
   * This method copies the value of the age field for the age HTML and copies
   * it to the component state.
   * 
   * @param {object} event The HTML event
   * @memberof PatientComponent
   */
  handleSelectAge(event) {    
    if (this.isAgeValid(event.target.value, event.target.id)) {
      this.setState({ [event.target.id]: event.target.value });
      this.setState((previousState) => {
        this.state.ageErrorObject.minAgeErrorMsg === '' &&
          this.state.ageErrorObject.maxAgeErrorMsg === '' ?
          previousState.ageErrorObject.status = false
          : null;
        return previousState;
      });
    } else {
      this.setState((previousState) => {
        previousState.ageErrorObject.status = true;
        return previousState;
      });
    }
  }

  /**
   * Method to reset search by attribute fields to default
   * @return {undefined}
   */
  resetSearchByAttributes() {
    this.setState({
      selectedAttribute: '',
      selectedAttributeValues: [],
    });
  }

  /**
   * Method to reset all state related to search by demographic in this
   * component
   * @return {undefined}
   */
  resetSearchByDemographics(event) {
    this.setState({
      startDate: '',
      endDate: '',
      livingStatus: '',
      gender: 'all',
      minAge: '',
      maxAge: '',
      ageErrorObject: {
        status: false,
        minAgeErrorMsg: '',
        maxAgeErrorMsg: '',
      },
    });

    /*
    * reset minAge and maxAge by targeting the elements directly
    * the element contents are handled with onKeyDown and onKeyUp
    */
    let minAgeField = document.getElementById('minAge');
    let maxAgeField = document.getElementById('maxAge');
    minAgeField.value = '';
    maxAgeField.value = '';
  }

  /**
   * Method to set the end date String in state
   * @param {String} value - isoString formatted date value
   * @return {undefined}
   */
  setEndDate(value) {
    this.setState({ endDate: this.getDateString(value) });
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
   * Method to add selected attribute values
   * @param {Array} selectedAttributeValues - Array containing selected
   * attribute values
   * @return {undefined}
   */
  handleAddAttributeValue(values) {
    this.setState({
      selectedAttributeValues: values.map(
        // disallow entering empty text
        item => item.label.trim() ? item : ''
      ) 
    });
  }

  /**
   * Method to handle selection of different attribute types
   * @param {Object} event - Event Object
   * @return {undefined}
   */
  handleSelectAttribute(event) {
    this.setState({ selectedAttribute: event.target.value });
    // TODO: should the user be able to enter attribute values 
    // when any attribute is selected ? For now No
    if (!event.target.value) {
      this.setState({ selectedAttributeValues: [] });
    }
  }

  /**
   * Method to get the date in the format MM-DD-YY from a date isoString
   * @param {String} isoString - Date in isoString format
   * @return {String} MM-DD-YY date formatted string
   */
  getDateString(isoString) {    
    return isoString ? isoString.split('T')[0] : '';
  }

  render() {
    let attributes = this.state.patientAttributes.map((attribute) => {
      return (
        <option key={attribute.uuid} value={attribute.uuid}>
          {attribute.display}
        </option>
      );
    });

    const {
      startDate,
      endDate,
      selectedAttribute,
      ageErrorObject,
    } = this.state;

    return (
      <div>
        <h3>Search By Demographic</h3>
        <form className="form-horizontal">
          <div className="form-group">
            <label htmlFor="gender" className="col-sm-2 control-label">Gender</label>
            <div className="col-sm-6">
              <select
                className="form-control"
                onChange={this.handleSelectGender}
                value={this.state.gender}
                id="gender"
                name="gender"
              >
                <option value="all">All</option>
                <option value="males">Male</option>
                <option value="females">Female</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-2 control-label">Age</label>

            <div className="col-sm-1">
              <span className="inline-label">Between:</span>
            </div>
            <div className={ageErrorObject ? "col-sm-3 error" : "col-sm-3"}>
              <input
                min="0"
                type="number"
                name="minage"
                id="minAge"
                className="form-control"
                onKeyUp={this.handleSelectAge}
                onKeyPress={this.handleValidateAgeInput}
                value={this.minAge}
              />
              <span>{ageErrorObject.status && ageErrorObject.minAgeErrorMsg}</span>
            </div>
            <span className="inline-label">And:</span>
            <div className={ageErrorObject ? "col-sm-3 error" : "col-sm-3"}>
              <input
                min="0"
                type="number"
                name="maxage"
                id="maxAge"
                className="form-control"
                onKeyUp={this.handleSelectAge}
                onKeyPress={this.handleValidateAgeInput}
                value={this.maxAge}
              />
              <span>{ageErrorObject.status && ageErrorObject.maxAgeErrorMsg}</span>
            </div>
          </div>
          {startDate && !endDate || endDate && !startDate ?
            <div className="col-sm-offset-2 error">
              Select both Start and End <strong>Birthdates</strong> or none.
                    </div> : null}
          <div className="form-group">
            <label className="col-sm-2 control-label">Birthdate</label>

            <div className="col-sm-1">
              <span className="inline-label">Between:</span>
            </div>
            <div
              className={`col-sm-3 ${endDate && !startDate ? 'has-error' : ''}`}
            >
              <DatePicker
                className="form-control"
                id="startDate"
                dateFormat="DD-MM-YYYY"
                value={startDate}
                onChange={this.handleDateChange('startDate')}
              />
            </div>
            <span className="inline-label">And:</span>
            <div
              className={`col-sm-3 ${startDate && !endDate ? 'has-error' : ''}`}
            >
              <DatePicker
                className="form-control"
                id="endDate"
                dateFormat="DD-MM-YYYY"
                value={endDate}
                onChange={this.handleDateChange('endDate')}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-6">
              <div className="checkbox patient-status">
                <label>
                  <input
                    type="radio"
                    value="alive"
                    name="livingStatus"
                    checked={this.state.livingStatus === 'alive'}
                    onChange={this.toggleLivingStatus}
                  /> Alive Only
                </label>
                <label>
                  <input
                    type="radio"
                    value="dead"
                    name="livingStatus"
                    checked={this.state.livingStatus === 'dead'}
                    onChange={this.toggleLivingStatus}
                  /> Dead Only
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-6">
              <button
                type="submit"
                onClick={this.searchDemographics}
                className="btn btn-success"
                disabled={ageErrorObject.status}
              >Search</button>
              <button
                onClick={this.resetSearchByDemographics}
                className="btn btn-default cancelBtn"
              >Reset</button>
            </div>
          </div>
        </form>

        <h3>Search By Person Attributes</h3>
        <form className="form-horizontal">
          <div className="form-group">
            <label htmlFor="gender" className="col-sm-2 control-label">Which Attribute</label>
            <div className="col-sm-3">
              <select
                className="form-control"
                id="attributeType"
                value={selectedAttribute}
                onChange={this.handleSelectAttribute}
              >
                <option value="">Any</option>
                {attributes}
              </select>
            </div>
            <label className="col-sm-1 control-label">Values</label>
            <div className="col-sm-4">
              <Creatable
                multi
                disabled={selectedAttribute ? false : true}
                placeholder={
                  `${selectedAttribute ? 'Enter Comma Delimited Values' :
                  'Select specific attribute to Enable'}`
                }
                value={this.state.selectedAttributeValues}
                onChange={this.handleAddAttributeValue}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-6">
              <button
                type="submit"
                onClick={this.searchByAttributes}
                className="btn btn-success"
              >Search</button>
              <button
                onClick={this.resetSearchByAttributes}
                type="reset"
                className="btn btn-default cancelBtn"
              >Reset</button>
            </div>
          </div>
        </form>
        <hr />
      </div>
    );
  }
}

PatientComponent.propTypes = {
  addToHistory: React.PropTypes.func.isRequired,
  search: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired
};

export default PatientComponent;
