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
import DatePicker from "react-bootstrap-date-picker";
import Error from '../../common/error';
import Loader from '../../common/loader';
import shortid from 'shortid';

class DrugOrderComponent extends Component {
  constructor(props) {
    super();
    this.state = {
      activeDrugsMonth: '',
      activeDrugsDays: '',
      activeDrugsEndDate: '',
      activeDrugsStartDate: '',
      stoppedDrugsMonth: '',
      stoppedDrugsDays: '',
      stoppedDrugsEndDate: '',
      stoppedDrugsStartDate: '',
      drugRegimen: '',
      drugs: [],
      generics: [],
      reasons: [],
      loading: true
    };

    this.resetPatientsTakingSpecificDrugs = this.resetPatientsTakingSpecificDrugs.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnKeyPress = this.handleOnKeyPress.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleValidateCountInput = this.handleValidateCountInput.bind(this);
    this.getDateString = this.getDateString.bind(this);
    this.resetPatientsWhoStoppedTakingDrugs = this.resetPatientsWhoStoppedTakingDrugs.bind(this);
  }

  componentWillMount() {
    this.props.fetchData('drug')
      .then((drugs) => {
        const allDrugGenerics = {};
        const conceptsGenerics = drugs.results.map((eachDrug) => {
          return new Promise((resolve, reject) => {
            this.props.fetchData(`drug/${eachDrug.uuid}`).then((drugDetails) => {
              allDrugGenerics[drugDetails.concept.uuid] = drugDetails.concept.display;
              resolve(allDrugGenerics);
            });
          });
        });
        Promise.all(conceptsGenerics).then(drugGenerics => {
          this.setState({
            drugs: drugs.results,
            generics: drugGenerics[0]
          });
        });
      }).catch((error) => {
        this.setState({ error: true, message: error.message });
      });
    this.props.fetchData('concept?name=REASON%20ORDER%20STOPPED')
      .then(conceptReason => {
        conceptReason.results[0] && this.props.fetchData(`concept/${conceptReason.results[0].uuid}`)
          .then(conceptDetails => {
            this.setState({
              reasons: conceptDetails.answers
            });
          });
      });
    this.setState({ loading: false });
  }

  showGenerics() {
    const genericsDisplay = [];
    for(let uuid in this.state.generics) {
      genericsDisplay.push(<option value={uuid} key={shortid.generate()}>{this.state.generics[uuid]}</option>);
    }
    return genericsDisplay;
  }

  showOptions(selectData) {
    return selectData.map((eachOption) =>
      <option value={eachOption.uuid} key={shortid.generate()}>{eachOption.display}</option>
    );
  }

  handleOnKeyPress(event){
    if (typeof event.key === 'boolean' || isNaN(event.key)) {
      event.preventDefault();
    } 
  }
         
  handleValidateCountInput(event) {
    // validate if the user inputs a number
    const invalidCharacters = [
      '-',
      '+',
      'e'
    ];
    
    (invalidCharacters.includes(event.key)) ? event.preventDefault() : null;
  }

  handleOnChange(event) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  }

  /**
   * Method to get the date in the format MM-DD-YY from a date isoString
   * @param {String} isoString - Date in isoString format
   * @return {String} MM-DD-YY date formatted string
   */
  getDateString(isoString) {    
    return isoString ? isoString.split('T')[0] : '';
  }

  handleDateChange(dateType){
    return value => this.setState({
      [dateType]: this.getDateString(value)
    });
  }

  resetPatientsTakingSpecificDrugs(event) {
    event.preventDefault();
    document.getElementById("inlineRadio1").checked = false;
    document.getElementById("inlineRadio2").checked = false;
    this.setState({
      activeDrugsMonth: '',
      activeDrugsDays: '',
      activeDrugsEndDate: '',
      activeDrugsStartDate: '',
    });
  }

  resetPatientsWhoStoppedTakingDrugs(event) {
    event.preventDefault();
    this.setState({
      stoppedDrugsMonth: '',
      stoppedDrugsDays: '',
      stoppedDrugsEndDate: '',
      stoppedDrugsStartDate: '',
    });
  }

  render() {
    if(this.state.loading) {
      return (
                <Loader />
      );
    } else if(this.state.error) {
      return(
        <Error message={this.state.message}/>
      );
    } else {
      return (
        <div>
          <h3>Search By Drug Order</h3>
          <h4 className="text-center">Patients taking specific drugs</h4>
          <form className="form-horizontal">
            <div className="form-group">
              <label htmlFor="drug" className="col-sm-2 control-label">Drug(s)</label>
              <div className="col-sm-6">
                <select className="form-control" multiple="multiple" id="drug" name="drug">
                  {this.showOptions(this.state.drugs)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label">Drug Regimen</label>
              <div className="col-sm-6">
                <label className="radio-inline">
                  <input type="radio" name="drugRegimen" id="inlineRadio1" value="option1"/>
                  Current Drug Regimen
                </label>
                <label className="radio-inline">
                  <input type="radio" name="drugRegimen" id="inlineRadio2" value="option2"/>
                  Specific Drug Regimen(s)
                </label>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">When?</label>
              <div className="col-sm-2">
                <span className="inline-label">For the last:</span>
              </div>
              <div className="col-sm-2">
                <input
                  className="form-control"
                  type="number"
                  name="activeDrugsMonth"
                  min="0"
                  pattern="[0-9]*"
                  value={this.state.activeDrugsMonth}
                  onKeyDown={this.handleValidateCountInput}
                  onKeyPress={this.handleOnKeyPress}
                  onChange={this.handleOnChange}
                />
              </div>
              <span className="inline-label">months and :</span>
              <div className="col-sm-2">
                <input
                  className="form-control"
                  name="activeDrugsDays"
                  type="number"
                  min="0"
                  value={this.state.activeDrugsDays}
                  pattern="[0-9]*"
                  onKeyDown={this.handleValidateCountInput}
                  onKeyPress={this.handleOnKeyPress}
                  onChange={this.handleOnChange}
                />
              </div>
              <span className="inline-label">days    (optional)</span>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">Date Range</label>
              <div className="col-sm-1">
                <span className="inline-label">From:</span>
              </div>
              <div className="col-sm-3">
                <DatePicker
                  dateFormat="DD-MM-YYYY"
                  className="form-control"
                  name="from-date"
                  id="activeDrugsStartDate"
                  value={this.state.activeDrugsStartDate}
                  onChange={this.handleDateChange('activeDrugsStartDate')}
                />
              </div>
              <span className="inline-label">To:</span>
              <div className="col-sm-3">
                <DatePicker
                  dateFormat="DD-MM-YYYY"
                  className="form-control"
                  name="to-date"
                  id="activeDrugsEndDate"
                  value={this.state.activeDrugsEndDate}
                  onChange={this.handleDateChange('activeDrugsEndDate')}
                />
              </div>
              <span className="inline-label">(optional)</span>
            </div>

            <div className="form-group">
              <div className="col-sm-offset-2 col-sm-6">
                <button type="submit" className="btn btn-success">Search</button>
                <button 
                  type="reset"
                  className="btn btn-default cancelBtn"
                  onClick={this.resetPatientsTakingSpecificDrugs}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
          <br/>
          <h4 className="text-center">Patients who stopped or changed a drug</h4>
          <form className="form-horizontal">
            <div className="form-group">
              <label className="col-sm-2 control-label">When?</label>
              <div className="col-sm-2">
                <span className="inline-label">Within the last:</span>
              </div>
              <div className="col-sm-2">
                <input
                  className="form-control"
                  type="number"
                  name="stoppedDrugsMonth"
                  min="0"
                  pattern="[0-9]*"
                  value={this.state.stoppedDrugsMonth}
                  onKeyDown={this.handleValidateCountInput}
                  onKeyPress={this.handleOnKeyPress}
                  onChange={this.handleOnChange} 
                />
              </div>
              <span className="inline-label">months and :</span>
              <div className="col-sm-2">
                <input
                  className="form-control"
                  type="number"
                  name="stoppedDrugsDays"
                  min="0"
                  pattern="[0-9]*"
                  value={this.state.stoppedDrugsDays}
                  onKeyDown={this.handleValidateCountInput}
                  onKeyPress={this.handleOnKeyPress}
                  onChange={this.handleOnChange}
                />
              </div>
              <span className="inline-label">days (optional)</span>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label">Date Range</label>
              <div className="col-sm-1">
                <span className="inline-label">From:</span>
              </div>
              <div className="col-sm-3">
                <DatePicker
                  dateFormat="DD-MM-YYYY"
                  className="form-control"
                  name="from-date"
                  id="stoppedDrugsStartDate"
                  value={this.state.stoppedDrugsStartDate}
                  onChange={this.handleDateChange('stoppedDrugsStartDate')}
                />
              </div>
              <span className="inline-label">To:</span>
              <div className="col-sm-3">
                <DatePicker
                  dateFormat="DD-MM-YYYY"
                  className="form-control"
                  name="to-date"
                  id="stoppedDrugsEndDate"
                  value={this.state.stoppedDrugsEndDate}
                  onChange={this.handleDateChange('stoppedDrugsEndDate')}
                />
              </div>
              <span className="inline-label">(optional)</span>
            </div>
            <br/><br/>
            <div className="form-group">
              <div className="col-md-4">
                <p className="text-center">Reason(s) for change</p>
                <select className="form-control" multiple="multiple" id="drug" name="drug">
                  {this.showOptions(this.state.reasons)}
                </select>
              </div>

              <div className="col-md-4">
                <p className="text-center">Only these drugs</p>
                <select className="form-control" multiple="multiple" id="drug" name="drug">
                  {this.showOptions(this.state.drugs)}
                </select>
              </div>

              <div className="col-md-4">
                <p className="text-center">Only these generics</p>
                <select className="form-control" multiple="multiple" id="drug" name="drug">
                  {this.showGenerics()}
                </select>
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-offset-2 col-sm-6">
                <button type="submit" className="btn btn-success">Search</button>
                <button
                  type="reset"
                  className="btn btn-default cancelBtn"
                  onClick={this.resetPatientsWhoStoppedTakingDrugs}
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
}

DrugOrderComponent.propTypes = {
  fetchData: PropTypes.func.isRequired
};

export default DrugOrderComponent;
