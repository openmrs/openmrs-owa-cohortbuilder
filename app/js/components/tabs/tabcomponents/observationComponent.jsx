/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import DatePicker from "react-bootstrap-date-picker";
import shortid from 'shortid';
import { JSONHelper } from '../../../helpers/jsonHelper';
import utility from '../../../utility';

export default class ObsFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      timeModifier: 'ANY',
      question: props.concept.uuid,
      operator: '',
      modifier: '',
      onOrBefore: '',
      onOrAfter: '',
      formToRender: '',
    };
    this.jsonHelper = new JSONHelper();

    this.setRef = this.setRef.bind(this);
    this.whatValue = this.whatValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputWithUnit = this.inputWithUnit.bind(this);
    this.firstFieldNumeric = this.firstFieldNumeric.bind(this);
    this.timeModifierDateOrDateTime = this.timeModifierDateOrDateTime.bind(this);
    this.timeModifierSCB = this.timeModifierSCB.bind(this);
    this.secondFieldNumeric = this.secondFieldNumeric.bind(this);
    this.modifierDateOrDateTime = this.modifierDateOrDateTime.bind(this);
    this.secondFieldBoolean = this.secondFieldBoolean.bind(this);
    this.endForm = this.endForm.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.nullDatatype = this.nullDatatype.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  componentDidUpdate() {
    this.textInput ?  this.textInput.focus() : false;
  }

  handleFormChange(event) {
    event.preventDefault();
    this.setState({
      [ event.target.name ] :  event.target.value
    });
  }

  handleReset() {
    this.setState({
      timeModifier: 'ANY',
      operator: '',
      modifier: '',
      onOrBefore: '',
      onOrAfter: '',
      formToRender: '',
    });
  }

  setRef(input) {
    this.textInput = input; 
  }

  handleSubmit(event) {
    event.preventDefault();
    const types = {
      CWE: 'codedObsSearchAdvanced',
      NM:  'numericObsSearchAdvanced',
      DT:  'dateObsSearchAdvanced',
      ST:  'dateObsSearchAdvanced',
      TS:  'textObsSearchAdvanced',
      ZZ:  'codedObsSearchAdvanced',
      BIT: 'codedObsSearchAdvanced'
    };
    const { hl7Abbrev, name } =  this.props.concept;
    const dataType = types[hl7Abbrev];
    const params = { [ dataType ] : []  };
    Object.keys(this.state).forEach(key => {
      this.state[key] !== "" ?  params[dataType].push({
        name: key === 'modifier'? ['CWE', 'TS'].includes(hl7Abbrev) ? 'values' : 'value' : key,
        value: key === 'modifier' && ['CWE', 'TS'].includes(hl7Abbrev)?  [ this.state[key] ] : this.state[key]
      }) : '';
    });
    const searchData = this.jsonHelper.composeJson(params);
    let description = `Patients with observations whose question is ${name}`;
    if (hl7Abbrev === 'ZZ' && this.state.timeModifier === 'ANY') {
      description = `Patients whose observation has value ${name}`;
    }
    if (hl7Abbrev === 'ZZ' && this.state.timeModifier === 'NO') {
      description = `Patients whose observation dose not have value ${name}`;
    }
    this.props.search(searchData, description)
            .then((data) => {
              if (JSON.stringify(data.rows) === JSON.stringify([])) {
                utility.notifications('info', 'Search completed successfully but no results found');
              } else {
                utility.notifications('success', 'Search completed successfully');
              }
              this.props.addToHistory(description, data.rows, searchData.query);
            }).catch(() => utility.notifications('error', 'Search error, check the server log for details'));

  }
  handleDateChange(name) {
    return (value) => this.setState({ [ name ] :  value });
  }

  // ST(Text) OR CWE(coded)
  inputWithUnit() {
    return (
      <div key={shortid.generate()} className="form-group">
        <label  className="col-sm-3 control-label">What values?</label>
        <div className="col-sm-4">
            <input type="text"
              className="form-control" 
              placeholder="Enter a value"
              onChange={this.handleFormChange}
              name="modifier"
              id="modifier"
              />
        </div>
      </div>
    );
  }
    
  // NM(numeric) datatype
  firstFieldNumeric(){
    return(
            <div key={shortid.generate()} className="form-group" >
                <label className="col-sm-3 control-label">Which observations?</label>
                <div className="col-sm-6">
                    <select 
                        className="form-control"
                        value={this.state.timeModifier}
                        defaultValue="ANY"
                        name="timeModifier"
                        onChange={this.handleFormChange}>
                        <option value="ANY">Any</option>
                        <option value="NO">None</option>
                        <option value="FIRST">Earliest</option>
                        <option value="LAST">Most Recent</option>
                        <option value="MIN">Lowest</option>
                        <option value="MAX">Highest</option>
                        <option value="AVG">Average</option>
                    </select>
                </div>
            </div>
    );
  }

  // DT(Date) OR TS(DateTime)
  timeModifierDateOrDateTime() {
    return (
      <div key={shortid.generate()} className="form-group" >
        <label className="col-sm-4 control-label"> Which observations? </label>
        <div className="col-sm-4">
          <select className="form-control" 
            name="timeModifier"
            value={this.state.timeModifier}
            defaultValue="ANY"
            onChange={this.handleFormChange}>
            <option value="ANY">Any</option>
            <option value="NO">None</option>
            <option value="MIN">Earliest Value</option>
            <option value="MAX">Most Recent Value</option>
            <option value="FIRST">Earliest Recorded</option>
            <option value="LAST">Most Recent Recorded</option>
          </select>
        </div>
      </div>
    );
  }

  // ST(Text)  OR CWE(Coded) OR BIT(Boolean)
  timeModifierSCB() {
    return (
            <div key={shortid.generate()} className="form-group" >
                    <label className="col-sm-4 control-label"> Which observations? </label>
                    <div className="col-sm-4">
                        <select className="form-control" 
                            name="timeModifier"
                            defaultValue="ANY"
                            onChange={this.handleFormChange}
                            value={this.state.timeModifier}>
                            <option value="">select an observation</option>
                            <option value="ANY">Any</option>
                            <option value="NO">None</option>
                            <option value="FIRST">Earliest</option>
                            <option value="LAST">Most Recent</option>
                        </select>
                    </div>
            </div>
    );
  }

  // NM(numeric) datatype
  secondFieldNumeric() {
    return(
            <div key={shortid.generate()}  className="form-group" >
                <label  className="col-sm-3 control-label">What values?</label>
                <div className="col-sm-2">
                    <select className="form-control" name="operator" 
                        onChange={this.handleFormChange}
                        value={this.state.operator}>
                        <option value="LESS_THAN">&lt;</option>
                        <option value="LESS_EQUAL">&lt;=</option>
                        <option value="EQUAL">=</option>
                        <option value="GREATER_EQUAL">&gt;=</option>
                        <option value="GREATER_THAN">&gt;</option>
                    </select>
                </div>
                <div className="col-sm-4">
                    <input type="number"
                        className="form-control" 
                        placeholder={`Enter a value ${this.props.concept.units}`}
                        value={this.state.modifier}
                        name="modifier"
                        ref={this.setRef}
                        onChange={this.handleFormChange} />
                </div>
            </div>
    );
  }

  // DT(Date) OR TS(DateTime)
  modifierDateOrDateTime() {
    return (
            <div className="form-group col-sm-12" key={shortid.generate()} >
                <label  className="col-sm-4 control-label">(optional) (valueDatetime)?</label>
                <div className="col-sm-4">
                    <select className="form-control" name="operator" id="operator"
                        value={this.state.operator} 
                        onChange={this.handleFormChange}>
                        <option value="">select a range</option>
                        <option value="LESS_THAN">before</option>
                        <option value="LESS_EQUAL">on or before</option>
                        <option value="EQUAL">on</option>
                        <option value="GREATER_EQUAL">on or after</option>
                        <option value="GREATER_THAN">after</option>
                    </select>
                </div>
                <div className="col-sm-4">
                    <DatePicker
                            className="form-control"
                            id="modifier"
                            dateFormat="DD-MM-YYYY"
                            value={this.state.modifier}
                            name="modifier"
                            onChange={this.handleDateChange('modifier')}
                        />
                </div>
            </div>
    );
  }

  //ST(Text) OR CWE(coded)
  whatValue() { 
    const { answers } = this.props.concept;
    const option = (answer) => (
            <option key={answer.uuid} value={answer.uuid} > {answer.display} </option >
        );
    return( 
      answers.length > 0  ?
      <div className="form-group col-sm-12" key={shortid.generate()} >
          <label className="col-sm-4 control-label" >(optional) What value?</label>
          <div className="col-sm-4">
              <select className="form-control"
                id="modifier" 
                value={this.state.modifier}
                onChange={this.handleFormChange}
                name="modifier">
                <option value="">select a value</option>
                {answers.map(option)}
              </select>
          </div>
      </div> : ""
    );
  }


  // BIT(Boolean)
  secondFieldBoolean() {
    return (
      <div className="form-group " key={shortid.generate()}> 
        <label  className="col-sm-4 control-label">(optional) What values?</label>
        <div className="col-sm-6" name="modifier">
            <select className="form-control" 
                name="modifier"
                value={this.state.modifier}
                onChange={this.handleFormChange}>
                <option value="">select a value</option>
                <option value="true"> true</option>
                <option value="false">false</option>
            </select> 
        </div>
      </div>
    );
  }
    
  nullDatatype() {
    const { name } = this.props.concept;
    return (
      <div key={shortid.generate()}>
        <div className="form-group">
          <div className="col-sm-6 col-sm-offset-3">
              <select className="form-control" 
                id="timeModifier"
                name="timeModifier"
                value={this.state.timeModifier}
                onChange={this.handleFormChange}>
                <option value="ANY">Patients whose observation has value {name } </option>
                <option value="NO">Patients whose observation dose not have value { name } </option>
              </select>
          </div>
        </div>
      </div>
    );
  }


  endForm() {
    return (
      <div key={shortid.generate()} className="col-sm-12">
          <div className="form-group col-sm-12">
              <label className="col-sm-3 control-label">Date Range? Since:</label>
              <div className="col-sm-3">
                  <DatePicker
                      className="form-control"
                      id="onOrBefore"
                      dateFormat="DD-MM-YYYY"
                      value={this.state.onOrBefore}
                      onChange={this.handleDateChange('onOrBefore')}
                  />
              </div>
              <label className="col-sm-2 control-label">and/or Until:</label>
              <div className="col-sm-3">
                  <DatePicker
                      className="form-control"
                      id="onOrAfter"
                      dateFormat="DD-MM-YYYY"
                      value={this.state.onOrAfter}
                      onChange={this.handleDateChange('onOrAfter')}
                  />
              </div>
              <h5 className="col-sm-1">Optional</h5>
          </div>
          <div className="form-group">
              <div className="col-sm-offset-3 col-sm-6">
                  <button type="submit" className="btn btn-success" >Search</button>
                  <button
                    type="reset"
                    className="btn btn-default cancelBtn"
                    onClick={this.handleReset}
                  >Reset</button>
              </div>
          </div>
      </div>
    );
  }

  renderForm() {
    let str = [];
    let { hl7Abbrev } = this.props.concept; 
    if (['NM', 'ST', 'CWE', 'DT', 'TS', 'BIT'].includes(hl7Abbrev)) {       
      if (hl7Abbrev === 'NM')  {
        str.push(this.firstFieldNumeric());
      }  else if (hl7Abbrev == 'DT' || hl7Abbrev == 'TS') {
        str.push(this.timeModifierDateOrDateTime());
      }  else if (hl7Abbrev == 'ST' || hl7Abbrev == 'CWE' || hl7Abbrev == 'BIT') {
        str.push(this.timeModifierSCB());
      } 
      if (hl7Abbrev == 'NM') { 
        str.push(this.secondFieldNumeric());
      } else if (hl7Abbrev == 'ST') {
        str.push(this.inputWithUnit());
      }
      else if (hl7Abbrev == 'DT' || hl7Abbrev == 'TS') {
        str.push(this.modifierDateOrDateTime());
      } else if (hl7Abbrev == 'CWE') {
        str.push(this.whatValue());
      }  else if (hl7Abbrev == 'BIT') {
        str.push(this.secondFieldBoolean());
      }
    } else {
      str.push(this.nullDatatype());
    }
    str.push(this.endForm());

    return str;
  }

  render() {    
    return (
      <form className="form-horizontal col-sm-12" onSubmit={this.handleSubmit}>
      {  this.renderForm() }
      </form>
    );
  }
}


ObsFilter.propTypes = {
  concept: React.PropTypes.object.isRequired,
  search: React.PropTypes.func.isRequired,
  addToHistory: React.PropTypes.func

};
