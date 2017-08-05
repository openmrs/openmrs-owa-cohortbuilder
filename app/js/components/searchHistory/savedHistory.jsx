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

import React,{ Component, PropTypes } from 'react';
import shortId from 'shortid';
import DownloadHelper from '../../helpers/downloadHelper';
import SearchHistory from './searchHistoryComponent.jsx';
import { ApiHelper }  from '../../helpers/apiHelper';

/**
 * The SavedHistory Component class
 * 
 * @class SavedHistory
 * @extends {Component}
 */
class  SavedHistory extends Component {

  /**
   * Creates an instance of SavedHistory.
   * @param {Object} props 
   * @memberof SavedHistory
   */
  constructor(props) {
    super(props);
    this.state =  {
      history: [],
      allHistory: [],
      toDisplay: [],
      perPage: 10,
      description: "",
      currentPage: 2,
      totalPage: 0,
      downloadJobIds: []
    };
    this.apiHelper = new ApiHelper();
    this.delete = this.delete.bind(this);
    this.getPagePatient = this.getPagePatient.bind(this);
    this.navigatePage = this.navigatePage.bind(this);
    this.getPagePatient = this.getPagePatient.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);
    this.preFromatForCSV = this.preFromatForCSV.bind(this);
  }

  /**
   * This method performs some string manipulations
   * 
   * @param {String} value the string you want to manipulate
   * @returns 
   * @memberof SavedHistory
   */
  removeCharacters(value) {
    return value.substr(value.lastIndexOf(']') +1).trim();
  }

  /**
   * This method deletes a history by uuid
   * 
   * @param {Number} uuid 
   * @returns 
   * @memberof SavedHistory
   */
  delete(uuid) {
    return () => {
      const apiHelper = new ApiHelper();
      apiHelper.delete(`reportingrest/adhocdataset/${uuid}?purge=true`)
            .then(() => {
              this.props.updateHistory(uuid);
            });
    };
  }

  /**
   * This method views a search history by uuid
   * 
   * @param {Number} uuid 
   * @returns 
   * @memberof SavedHistory
   */
  viewResult(uuid) {
    return () => {
      this.apiHelper.get(`reportingrest/dataSet/${uuid}`)
                .then((res) => {
                  const toDisplay = this.getPagePatient(res.rows, 1);
                  this.setState(Object.assign({}, this.state, {
                    allHistory: res.rows,
                    currentPage: 1,
                    toDisplay,
                    totalPage:  Math.ceil(res.rows.length/this.state.perPage),
                    description: res.definition.description
                  }));
                });
    };
  }

  /**
   * This method gets all the search history for a particular page
   * 
   * @param {Array} allHistory 
   * @param {Integer} currentPage 
   * @returns 
   * @memberof SavedHistory
   */
  getPagePatient(allHistory, currentPage) {
    const pagePatientInfo = [];
    for (let index = (currentPage - 1) * this.state.perPage; index < currentPage * this.state.perPage && index < allHistory.length; index++) {
      pagePatientInfo.push (
        allHistory[index]
      );
    }
    return pagePatientInfo;
  }

  /**
   * This method handles the navigation direction
   * 
   * @param {Object} event the navigation event 
   * @memberof SavedHistory
   */
  navigatePage(event) {
    event.preventDefault();
    let pageToNavigate = 0;
    switch (event.target.value) {
      case 'first':
        pageToNavigate = 1;
        break;
      case 'last':
        pageToNavigate = this.state.totalPage;
        break;
      default:
        pageToNavigate = (event.target.value === 'next') ? this.state.currentPage + 1 : this.state.currentPage - 1;
    }
    const pagePatientInfo = this.getPagePatient(this.state.allHistory, pageToNavigate);
    this.setState(Object.assign({}, this.state, {
      toDisplay: pagePatientInfo,
      currentPage: pageToNavigate
    }));
  }

  /**
   * Method to help filter and return only required patient attributes from a
   * saved history item
   * 
   * @param {Array} results - Array of patient objects
   * @return {Array} - Array containing objects containing only necessary
   * data of patients in a saved history
   */
  preFromatForCSV(results) {
    const data = [...results];
    return data.map(patient => {
      return { 
        name: `${patient.firstname} ${patient.lastname}`,
        age: patient.age,
        gender: patient.gender
      };
    });
  }

  /**
   * Method to fetch data using the saved patients uuid, format the data and
   *  download it on the browser
   * 
   * @param {Number} uuid - unique saved patients history id
   * @param {String} description - Description of the patient history item
   * (to be used as the file name)
   * @return {undefined}
   */
  downloadCSV(uuid, description) {
    return event => {
      event.preventDefault();
      if (this.state.downloadJobIds.includes(uuid)) {
        return;
      }
      const downloadJobIds = [...this.state.downloadJobIds, uuid];
      this.setState({ downloadJobIds });
      this.apiHelper.get(`reportingrest/dataSet/${uuid}`)
        .then(response => {
          const toSplice = this.state.downloadJobIds;
          const spliceIndex = toSplice.indexOf(uuid);
          toSplice.splice(spliceIndex, 1);
          this.preFromatForCSV(response.rows);
          const formattedData = this.preFromatForCSV(response.rows);
          DownloadHelper.downloadCSV(formattedData, description);
          this.setState({ downloadJobIds: toSplice });
        }); 
    };
  }

  /**
   * This method renders the SavedHistory component
   * 
   * @returns 
   * @memberof SavedHistory
   */
  render() {
    return (
      <div className="section">
          <div className="result-window">
              {
                (this.props.history.length > 0) ?
                  <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Display</th>
                            <th>Description</th>
                            <th className="row-icon">Download</th>
                            <th className="row-icon">Delete</th>
                            <th className="row-icon">View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.history.map((eachResult, index) =>
                                (<tr key={shortId.generate()}>
                                    <td>{index + 1}</td>
                                    <td>{this.removeCharacters(eachResult.name)}</td>
                                    <td>{eachResult.description +' result(s)'}</td>
                                    <td className="row-icon">
                                        <span
                                            className={`glyphicon ${this.state.downloadJobIds.includes(eachResult.uuid) ? 'glyphicon-refresh glyphicon-spin' : 'glyphicon-download download'}`}
                                            title="Download"
                                            aria-hidden="true"
                                            onClick={this.downloadCSV(eachResult.uuid, eachResult.description)}
                                        />
                                    </td>
                                    <td className="row-icon"><span className="glyphicon glyphicon glyphicon-remove remove" title="Remove" onClick={this.delete(eachResult.uuid)} aria-hidden="true"/></td>
                                    <td className="row-icon"><span className="glyphicon glyphicon-eye-open view" onClick={this.viewResult(eachResult.uuid)} title="View" aria-hidden="true"/></td>
                                </tr>)
                            )
                        }
                    </tbody>
                  </table>
                : <p className="text-center">No search History</p>
              }
          </div>
      </div>
    );
  }
}

/**
 * Proptype validation for the SavedHistory Component
 */
SavedHistory.propTypes = {
  history: PropTypes.array.isRequired,
  updateHistory: PropTypes.func.isRequired
};

export default SavedHistory;
