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
import DatePicker from "react-bootstrap-date-picker";
import Error from '../../common/error';
import Loader from '../../common/loader';
import shortid from 'shortid';

/**
 * The DrugOrderComponent Component class
 * 
 * @class DrugOrderComponent
 * @extends {Component}
 */
class DrugOrderComponent extends Component {

  /**
   * Creates an instance of DrugOrderComponent.
   * @param {Object} props 
   * @memberof DrugOrderComponent
   */
  constructor(props) {
    super();
    this.state = {
      drugs: [],
      generics: [],
      reasons: [],
      loading: true
    };
  }

  /**
   * This method executes before the component has been rendered 
   * 
   * @memberof DrugOrderComponent
   */
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
              conceptReason.results && this.props.fetchData(`concept/${conceptReason.results[0].uuid}`)
                    .then(conceptDetails => {
                      this.setState({
                        reasons: conceptDetails.answers
                      });
                    });
            });
    this.setState({ loading: false });
  }

  /**
   * This method shows the generics
   * 
   * @returns 
   * @memberof DrugOrderComponent
   */
  showGenerics() {
    const genericsDisplay = [];
    for(let uuid in this.state.generics) {
      genericsDisplay.push(<option value={uuid} key={shortid.generate()}>{this.state.generics[uuid]}</option>);
    }
    return genericsDisplay;
  }

  /**
   * This method shows the options 
   * 
   * @param {Array} selectData 
   * @returns 
   * @memberof DrugOrderComponent
   */
  showOptions(selectData) {
    return selectData.map((eachOption) =>
        <option value={eachOption.uuid} key={shortid.generate()}>{eachOption.display}</option>
    );
  }

  /**
   * This method renders the DrugOrderComponent component
   * 
   * @returns 
   * @memberof DrugOrderComponent
   */
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
                            <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"/> Current Drug Regimen
                        </label>
                        <label className="radio-inline">
                            <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"/> Specific Drug Regimen(s)
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-2 control-label">When?</label>
                    <div className="col-sm-2">
                        <span className="inline-label">For the last:</span>
                    </div>
                    <div className="col-sm-2">
                        <input className="form-control" type="text" name="month" />
                    </div>
                    <span className="inline-label">months and :</span>
                    <div className="col-sm-2">
                        <input className="form-control" name="days" type="text" />
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
                        />
                    </div>
                    <span className="inline-label">To:</span>
                    <div className="col-sm-3">
                        <DatePicker
                            dateFormat="DD-MM-YYYY"
                            className="form-control"
                            name="to-date"
                        />
                    </div>
                    <span className="inline-label">(optional)</span>
                </div>

                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-6">
                        <button type="submit" className="btn btn-success">Search</button>
                        <button type="reset" className="btn btn-default cancelBtn">Reset</button>
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
                        <input className="form-control" type="text" name="month" />
                    </div>
                    <span className="inline-label">months and :</span>
                    <div className="col-sm-2">
                        <input className="form-control" name="days" type="text" />
                    </div>
                    <span className="inline-label">days(optional)</span>
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
                        />
                    </div>
                    <span className="inline-label">To:</span>
                    <div className="col-sm-3">
                        <DatePicker
                            dateFormat="DD-MM-YYYY"
                            className="form-control"
                            name="to-date"
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
                        <button type="reset" className="btn btn-default cancelBtn">Reset</button>

                    </div>
                </div>
            </form>
        </div>
      );
    }
  }
}

/**
 * Proptype validation for the DrugOrderComponent component
 */
DrugOrderComponent.propTypes = {
  fetchData: PropTypes.func.isRequired
};

export default DrugOrderComponent;
