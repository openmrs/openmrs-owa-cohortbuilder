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

import React, { PropTypes, Component } from 'react';
import shortId from 'shortid';
import { Navigate } from './navigate';

/**
 * The cohortTable Component class 
 * 
 * @class cohortTable
 * @extends {Component}
 */
class cohortTable  extends Component {

  /**
   * Creates an instance of cohortTable.
   * @param {Object} props 
   * @memberof cohortTable
   */
  constructor(props) {
    super(props);
    this.state = {
      searchHistory : [],
      currentPage: 1,
      toDisplay: [],
      totalPage: 0,
      perPage: 10,
      description: '',
      index: 0,
    };
    this.navigatePage = this.navigatePage.bind(this);
    this.getPagePatient = this.getPagePatient.bind(this);
  }
  
  /**
   * This method updates the state when a new prop is revieved
   * 
   * @param {Object} nextProps 
   * @memberof cohortTable
   */
  componentWillReceiveProps(nextProps) {
    const pagePatientInfo = this.getPagePatient(nextProps.toDisplay, 1);
    this.setState({
      toDisplay: pagePatientInfo,
      searchHistory: nextProps.toDisplay,
      totalPage: Math.ceil(nextProps.toDisplay.length/this.state.perPage),
      description: nextProps.description,
      currentPage: 1,
    });
  }

  /**
   * This method contains logic for the pagination being displayed on
   * the front end
   * 
   * @param {Object} event the event 
   * @memberof cohortTable
   */
  navigatePage(event) {
    event.preventDefault();
    let pageToNavigate = 0;
    switch(event.target.value) {
      case 'first': pageToNavigate = 1; break;
      case 'last': pageToNavigate = this.state.totalPage; break;
      default: pageToNavigate = (event.target.value === 'next') ? this.state.currentPage+1 : this.state.currentPage-1;
    }
    const pagePatientInfo = this.getPagePatient(this.state.searchHistory, pageToNavigate);
    this.setState({ toDisplay: pagePatientInfo, currentPage: pageToNavigate });
  }

  /**
   * This method gets all the patients data for a particular page
   * 
   * @param {Array} allPatients 
   * @param {Integer} currentPage 
   * @returns 
   * @memberof cohortTable
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
   * This method renders the cohortTable component
   * 
   * @returns 
   * @memberof cohortTable
   */
  render() {
    return (
      <div className="table-window">
        <button
          id="back" 
          className="btn btn-success"
          onClick={this.props.back}
        >
          Back
        </button>
        
        {this.state.toDisplay.length > 0 ?
          <div className="table">
            <h1 className="text-center">{this.state.description}</h1>
            <table className="table table-striped" >
              <thead>
                <tr>
                  <td>NAME</td>
                  <td>AGE</td>
                  <td>GENDER</td>
                </tr>
              </thead>
              <tbody>
                { this.state.toDisplay.map((patient) => {
                    return (
                      <tr key={shortId.generate()}>
                        <td>{ 
                          patient.hasOwnProperty('firstname') ? 
                          patient.firstname + " " + patient.lastname : patient.name
                        }</td>
                        <td>{patient.age}</td>
                        <td>{patient.gender}</td>
                      </tr>
                    );
                  })
                } 
              </tbody> 
            </table>
            <Navigate totalPage={this.state.totalPage} currentPage={this.state.currentPage} navigatePage={this.navigatePage} />
          </div>
          : <h1 className="text-center">No result found for {this.state.description}</h1>
        }
      </div>
    );
  }
}

/**
 * Proptype validation for the cohortTable component
 */
cohortTable.propTypes = {
  toDisplay: PropTypes.array.isRequired,
  description: PropTypes.string.isRequired,
  back: PropTypes.func
};

export default cohortTable;
