/**
 * The contents of this file are subject to the OpenMRS Public License
 * Version 1.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 * Copyright (C) OpenMRS, LLC.  All Rights Reserved.
 */

import React, { Component, PropTypes } from 'react';
import { ApiHelper } from '../../helpers/apiHelper';
import { JSONHelper } from '../../helpers/jsonHelper'; 

import SearchHistory from './searchHistoryComponent.jsx';
import SavedHistory from './savedHistory.jsx';

/**
 * The SearchHistoryTab Component class
 * 
 * @class SearchHistoryTab
 * @extends {Component}
 */
class SearchHistoryTab  extends Component {

  /**
   * Creates an instance of SearchHistoryTab.
   * @param {Object} props 
   * @memberof SearchHistoryTab
   */
  constructor(props) {
    super(props);
    this.state = {
      history:[],
      error: null,
      loading: false
    };
    this.updateHistory = this.updateHistory.bind(this);
    this.saveSearch = this.saveSearch.bind(this);
    this.setError = this.setError.bind(this);
  }

  /**
   * This method fetches the search history and adds it to the state
   * 
   * @memberof SearchHistoryTab
   */
  componentDidMount() {
    const apiHelper = new ApiHelper();
    apiHelper.get('reportingrest/dataSetDefinition?v=full' )
            .then((res) => {
              this.setState({history: res.results});
              $('#myTab a[href="#cached"]').tab('show');
            });
  }

  /**
   * Please edit this if you know what this method does 
   * 
   * @param {Object} parameter 
   * @returns 
   * @memberof SearchHistoryTab
   */
  parse(parameter) {
    let result = {};
    result.description = parameter.description;
    result.type = parameter.parameters.type;
    result.customRowFilterCombination = parameter.parameters.customRowFilterCombination;
    result.columns = parameter.parameters.columns;
    result.rowFilters = [];
      
    let rowFilters = parameter.parameters.rowFilters;
    rowFilters.forEach(filter => {
      const rowFilter = {};
      filter.hasOwnProperty('key') ? rowFilter.key = filter.key : false;
      filter.hasOwnProperty('type') ? rowFilter.type = "org.openmrs.module.reporting.cohort.definition.CohortDefinition" : false;
      filter.hasOwnProperty('parameterValues') ? rowFilter.parameterValues = filter.parameterValues : false;
            
      result.rowFilters.push(rowFilter);
    });
        
    return result;
  }

  /**
   * This method deletes a search history
   * 
   * @param {Number} uuid 
   * @memberof SearchHistoryTab
   */
  updateHistory(uuid) {
    const history = this.state.history.filter((eachHistory) => eachHistory.uuid != uuid);
    this.setState({ history});
  }

  /**
   * This method displays an error to the user
   * 
   * @param {String} error the eror you want to display
   * @memberof SearchHistoryTab
   */
  setError(error) {
    this.setState( {error, loading: false} );
  }

  /**
   * The method adds a search hstory to the database
   * 
   * @param {Integer} index the index of the saved search
   * @param {String} name the name of the saved search
   * @returns 
   * @memberof SearchHistoryTab
   */
  saveSearch(index, name) {
    return new Promise((resolve, reject) => {
      const composer = new JSONHelper();
      const apiHelper = new ApiHelper();
      const query =  this.parse(this.props.history[index]);
      query.name = name;
      this.setState({loading: true});
      apiHelper.post('reportingrest/adhocdataset',  query )
                .then((res) => {
                  this.setState({
                    history : [...this.state.history , res]
                  });
                  this.setState({loading: false});
                  $('#myModal').modal('hide');
                  $('#myTab a[href="#saved"]').tab('show');
                  resolve(true);
                })
                .catch((error) => {
                  this.setError("An error occur, ensure you entered a valid name");
                  resolve(false);
                });
    });      
  }

  /**
   * This method renders the SearchHistoryTab component
   * 
   * @returns 
   * @memberof SearchHistoryTab
   */
  render() {
    return (
      <div className="section">
          <SearchHistory 
            history={this.props.history} 
            deleteHistory={this.props.deleteHistory} 
            saveSearch={this.saveSearch}
            error={this.state.error}
            loading={this.state.loading}
            getHistory = {this.props.getHistory} />
      </div>
    );
  }
}

/**
 * Proptypes validaion for the SearchHistoryTab component
 */
SearchHistoryTab.propTypes = {
  history: PropTypes.array.isRequired,
  deleteHistory: PropTypes.func.isRequired,
  getHistory: PropTypes.func
};

export default SearchHistoryTab;
