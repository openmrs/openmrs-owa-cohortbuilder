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

import React, {Component, PropTypes} from 'react';
import shortId from 'shortid';
import { ApiHelper } from '../../helpers/apiHelper';
import DownloadHelper from '../../helpers/downloadHelper';
import { JSONHelper } from '../../helpers/jsonHelper';
import CohortModal from '../cohorts/cohortModal';

import Modal from './saveModal.jsx';
import './searchHistory.css';

/**
 * The SearchHistoryComponent Component class
 * 
 * @class SearchHistoryComponent
 * @extends {Component}
 */
class SearchHistoryComponent extends Component {

  /**
   * Creates an instance of SearchHistoryComponent.
   * @param {Object} props 
   * @memberof SearchHistoryComponent
   */
  constructor(props) {
    super(props);
    this.state = {
      searchHistory : [],
      searchResults: [],
      currentPage: 1,
      toDisplay: [],
      totalPage: 0,
      perPage: 10,
      description: '',
      index: 0,
      queryId: 0
    };
    this.navigatePage = this.navigatePage.bind(this);
    this.historyItemData = this.historyItemData.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);
  }

  /**
   * This method handles the navigation direction for the pagination
   * 
   * @param {Object} event the pagination event
   * @memberof SearchHistoryComponent
   */
  navigatePage(event) {
    event.preventDefault();
    let pageToNavigate = 0;
    switch(event.target.value) {
      case 'first': pageToNavigate = 1; break;
      case 'last': pageToNavigate = this.state.totalPage; break;
      default: pageToNavigate = (event.target.value === 'next') ? this.state.currentPage+1 : this.state.currentPage-1;
    }
    const pagePatientInfo = this.getPagePatient(this.state.searchResults, pageToNavigate);
    this.setState({ toDisplay: pagePatientInfo, currentPage: pageToNavigate });
  }

  /**
   * This method displays the result 
   * 
   * @param {Index} index the index of the result
   * @param {String} description the description of the result
   * @returns 
   * @memberof SearchHistoryComponent
   */
  viewResult(index, description) {
    return (event) => {
      event.preventDefault();
      this.props.getHistory(this.props.history[index], description);
      const allPatients = this.props.history[index].patients;
      const pagePatientInfo = this.getPagePatient(allPatients, 1);
      this.setState({
        toDisplay: pagePatientInfo,
        searchResults: allPatients,
        description,
        totalPage: Math.ceil(allPatients.length/this.state.perPage),
        currentPage: 1,
      });
    };
  }

  /**
   * This method gets all the patients data for a particular page
   * 
   * @param {Array} allPatients 
   * @param {Integer} currentPage 
   * @returns 
   * @memberof SearchHistoryComponent
   */
  getPagePatient(allPatients, currentPage) {
    const pagePatientInfo = [];
    for(let index = (currentPage-1) * this.state.perPage; index < currentPage * this.state.perPage && index < allPatients.length; index++) {
      pagePatientInfo.push(
                allPatients[index]
            );
    }
    return pagePatientInfo;
  }

  /**
   * This method deletes a search history by index
   * 
   * @param {Integer} index 
   * @returns 
   * @memberof SearchHistoryComponent
   */
  delete(index) {
    return (event) => {
      event.preventDefault();
      let confirmResult = confirm("Are you sure you want to delete this search history item?");
      if(confirmResult){
        this.props.deleteHistory(index);
      }
    };
  }
    
  /**
   * This method adds the search result to the state
   * 
   * @param {Integer} index 
   * @returns 
   * @memberof SearchHistoryComponent
   */
  setSaveSearch(index) {
    const searchResult =  this.props.history[index];
    return () => {
      this.setState({index, description: searchResult.description});
    };
  }

  /**
   * Method to help filter and return only required patient attributes from a
   * search history item
   * 
   * @param { Number } index - Index of the history array to pick patients
   * @return { Array } - Array containing all patients in a search history
   * item of the specified index
   */
  historyItemData(index) {
    return this.props.history[index].patients.map(patient => {
      return {
        Name: `${patient.firstname} ${patient.lastname}`,
        Age: patient.age,
        Gender: patient.gender
      };
    });
  }

  /**
  * Method to download list of patients in CSV format

  * @param { Number } index - Index of the history array to pick patients
  * @param { String} description - Description of the search (to be used as
  * the csv file name)
  * @return { function } - Method to be triggered when a click event is fired
  */
  downloadCSV(index, description) {
    return (event) => {
      event.preventDefault();
      const patientsData = this.historyItemData(index);
      DownloadHelper.downloadCSV(patientsData, description);
    };
  }

  /**
   * This method adds the saved cohort details to the state
   * 
   * @param {String} description 
   * @param {Integer} index 
   * @returns 
   * @memberof SearchHistoryComponent
   */
  setSaveCohort(description, index) {
    return () => {
      this.setState({queryId : index, description});
    };
  }

  /**
   * This method displays the SearchHistoryComponent Component
   * 
   * @returns 
   * @memberof SearchHistoryComponent
   */
  render(){
    const { history } = this.props;
    return (
      <div>
        <Modal
          index={this.state.index}
          description={this.state.description}
          saveSearch={this.props.saveSearch}
          history={this.props.history}
          error={this.props.error}
          loading={this.props.loading}
        />
        <CohortModal 
          query={this.state.description}
          queryId={this.state.queryId}
          history={this.props.history}
        />
        <div className="col-sm-12 section">
            <h3>Search History</h3>
            <div className="result-window">
                
                {
                    (history.length > 0) ?
                      <table className="table table-striped">
                        <thead>
                            <tr>
                                <th className="table-header">#</th>
                                <th>Query</th>
                                <th>Query Definition Options</th>
                                <th>Results</th>
                                <th>Cohort Definition Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                history.map((eachResult, index) => 
                                (<tr key={shortId.generate()}>
                                    <th scope="row">{this.props.history.length - index}</th>
                                    <td>
                                        {eachResult.description}
                                    </td>
                                    <td> 
                                        <a className="link" title="Save Query Definition" aria-hidden="true"  data-toggle="modal" data-target="#myModal" onClick={this.setSaveSearch(index)}>Save</a>
                                        <a className="link" title={`Delete ${eachResult.description}`} onClick={this.delete(index)} aria-hidden="true">Delete</a>
                                    </td>
                                    <td>
                                        <a className="link" onClick={this.viewResult(index, eachResult.description)} title={`View ${eachResult.description}`} aria-hidden="true">{`${eachResult.patients.length} result(s)`}</a>
                                    </td>
                                    <td>
                                        <a className="link" onClick={this.downloadCSV(index, eachResult.description)} title={`Dowload ${eachResult.description}`} aria-hidden="true">Download</a>
                                        <a className="link" title="Save Cohorts" aria-hidden="true"  data-toggle="modal" data-target="#myCohort" onClick={this.setSaveCohort(eachResult.description, index)}>Save</a>
                                    </td>
                                </tr>)
                                )
                            }
                        </tbody>
                    </table>
                        : ""
                }
            </div>
        </div>
      </div>
    );
  }
}

/**
 * Proptype validation for the SearchHistoryComponent component
 */
SearchHistoryComponent.propTypes = {
  history: React.PropTypes.array.isRequired,
  deleteHistory: React.PropTypes.func.isRequired,
  saveSearch: PropTypes.func,
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  getHistory: PropTypes.func
};

export default SearchHistoryComponent;
