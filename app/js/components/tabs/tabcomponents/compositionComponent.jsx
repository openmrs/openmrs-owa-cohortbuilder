/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { Component, PropTypes } from 'react';
import { ApiHelper } from '../../../helpers/apiHelper';
import { JSONHelper } from '../../../helpers/jsonHelper';
import utility from '../../../utility';

class CompositionComponent extends Component {
  constructor(props) {
    super();
    this.state = {
      hasCompositionError: false,
      hasDescriptionError: false,
      compositionQuery: '',
      compositionLabel: ''
    };
    this.performComposition = this.performComposition.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }
    
  /**
   * The function takes the input of the text field and makes a search
   * @param {object} event 
   */
  performComposition(event) {
    event.preventDefault();
    const { compositionQuery, compositionLabel } = this.state;
    const search = compositionQuery
      .replace(/(\(|\))+/g, char => char === '(' ? '( ': ' )');
    const description = compositionLabel;
    try {
      if (!search || !this.searchIsValid(search)) {
        return this.setState({ hasCompositionError: true });
      }
      if (!compositionLabel.trim()) {
        return this.setState({ hasDescriptionError: true });
      }
      const jsonHelper = new JSONHelper();
      const compositionQuery = {};
      compositionQuery.type = "org.openmrs.module.reporting.dataset.definition.PatientDataSetDefinition";
      compositionQuery.columns = jsonHelper.addColumnsToDisplay();
      compositionQuery.customRowFilterCombination = '';
      compositionQuery.rowFilters = [];
      const searchTokens = search.split(/\s+/);
      const allHistory = JSON.parse(window.sessionStorage.getItem('openmrsHistory'));
      searchTokens.forEach(eachToken => {
        if(eachToken.match(/\d/)) {
          const operandQuery = allHistory[allHistory.length - eachToken];
          const jsonRequestObject = operandQuery.parameters;
          jsonRequestObject.customRowFilterCombination = this
            .formatFilterCombination(
              jsonRequestObject.customRowFilterCombination,
              compositionQuery.rowFilters.length
            );
          compositionQuery.customRowFilterCombination += `(${jsonRequestObject.customRowFilterCombination})`;
          compositionQuery.rowFilters = compositionQuery.rowFilters.concat(jsonRequestObject.rowFilters);
        } else {
          compositionQuery.customRowFilterCombination += ` ${eachToken} `;
        }
      });
      this.performSearch({label: compositionLabel, query: compositionQuery});
    } catch (error) {
      this.setState({ hasCompositionError: error ? true : false });
    }
    this.handleReset();
  }

  performSearch(compositionQuery) {
    const apiHelper = new ApiHelper(null);
    utility.notifications('info', 'Loading...', {showDuration: 0, timeOut: 10});
    apiHelper.post('reportingrest/adhocquery?v=full', compositionQuery.query).then(response => {
      response.json().then(data => {
        if (data.error){
          utility.notifications('error', 'Search error occured, check the server log for more details');
          return data.error;
        }
        else{
          if (JSON.stringify(data.rows) === JSON.stringify([])) {
            utility.notifications('info', 'Search completed successfully but no results found');
          } else {
            utility.notifications('success', 'Search completed successfully');
          }
          this.props.addToHistory(compositionQuery.label, data.rows, compositionQuery.query);
        }
      });
    }).catch(error => error);
  }

  /**
   * Method to check for validity of the search input field.
   * @param {search} - The search String to be validated
   * @return {Boolean} - True if the search string is valid, otherwise False
   */
  searchIsValid(search) {
    return search
      .match(/and|or|not|\d+|\)|\(|union|intersection|\!|\+/gi).length ===
      search.split(/\s+/g).length;
  }

  /**
   * 
   * This function basically helps in ensuring that the number used in
   * the customRowFilterCombination in the composition query syncs with
   * the index of the rowFilter.
   * @param {string} filterText 
   * @param {int} numberOfSearches 
   */
  formatFilterCombination(filterText, numberOfSearches) {
    return filterText.replace(/\d/, theDigit => parseInt(theDigit) + numberOfSearches);
  }

  /**
   * Method to reset fields in the composition search forms
   * @param {Object} event - Event Object
   * @return {undefined}
   */
  resetFields(event) {
    event.preventDefault();
    this.setState({
      hasCompositionError: false,
      hasDescriptionError: false,
      compositionLabel: '',
      compositionQuery: ''
    });
  }

  /**
   * Method to handle change events from the input fields
   * @param{event} - Event object triggered when input fields change
   * @return{undefined} - Returns undefined
   */
  handleInputChange(event) {
    event.preventDefault();
    const id = event.target.id;
    this.setState({ [id]: event.target.value });
    switch(id) {
      case 'compositionQuery': {
        return this.setState({ hasCompositionError: false });
      }
      case 'compositionLabel': {
        return this.setState({ hasDescriptionError: false });
      }
    }
  }

  handleReset() {
    this.setState ({
      hasCompositionError: false,
      hasDescriptionError: false,
      compositionQuery: '',
      compositionLabel: ''
    });
  }

  render() {
    return (
      <div id="compositions-wrapper">
        <div className="compositionsTitle">
          <h3>Boolean Search</h3>
        </div>
        <div>
          <p>Enter a search query and click search button below to execute:</p>
          <i>e.g: "(1 and 2) or not 3"<br />
              Query parameters supported are: AND, OR, NOT, UNION, INTERSECTION, !, +
          </i>
        </div>
        <form
          className="form-horizontal"
          id="composition-form"
          onSubmit={this.performComposition}
        >
          <div
            className={`form-group ${(this.state.hasCompositionError ? 'has-error' : '')}`}
          >
            <label
              className="control-label col-sm-2"
              htmlFor="composition-search-query"
            >
              Composition:
            </label>
            <div className="col-sm-6">
              <input
                id="compositionQuery"
                value={this.state.compositionQuery}
                type="text"
                className="form-control"
                placeholder="Enter search query"
                onChange={this.handleInputChange}
              />
            </div>
            <span className="inline-label">(Required)</span>
          </div>
          <div
            className={`form-group ${(this.state.hasDescriptionError ? 'has-error' : '')}`}
          >
            <label
              className="control-label col-sm-2"
              htmlFor="composition-description"
            >
              Description:
            </label>
            <div className="col-sm-6">
              <input
                id="compositionLabel"
                value={this.state.compositionLabel}
                type="text"
                className="form-control"
                placeholder="Enter a description"
                onChange={this.handleInputChange}
              />
            </div>
            <span className="inline-label">(Required)</span>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button
                type="submit"
                className="btn btn-success"
              >
                Search
              </button>
              <button
                type="reset"
                onClick={this.resetFields}
                className="btn btn-default cancelBtn"
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

CompositionComponent.propTypes = {
  addToHistory: PropTypes.func.isRequired,
};

export default CompositionComponent;
