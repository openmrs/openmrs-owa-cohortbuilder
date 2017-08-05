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

import React, { Component,PropTypes } from 'react';

import Components from './tabcomponents';
import TabBarComponent from './tabBarComponent';
import TabContentComponent from './tabContentComponent';
import { ApiHelper } from '../../helpers/apiHelper';
import { JSONHelper } from '../../helpers/jsonHelper';

import './tabs.css';

/**
 * The TabsComponentComponent class
 * 
 * @class TabsComponent
 * @extends {Component}
 */
class TabsComponent extends Component {

  /**
   * Creates an instance of TabsComponent.
   * @param {Object} props 
   * @memberof TabsComponent
   */
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        {active: true, name: 'Concept / Observation', divId: 'concept', component: Components.ConceptComponent },
        {active: false, name: 'Patient Attributes', divId: 'patient', component: Components.PatientComponent },
        {active: false, name: 'Encounter', divId: 'encounter', component: Components.EncounterComponent},
        {active: false, name: 'Programmme Enrollment', divId: 'programme', component: Components.ProgrammeComponent},
        {active: false, name: 'Composition', divId: 'composition', component:  Components.CompositionComponent },
        {active: false, name: 'Saved', divId: 'saved', component:  Components.SavedComponent }
      ]
    };
    this.search  = this.search.bind(this);
  }

  componentDidMount(){}

  /**
   * This method renders the tabs headers
   * 
   * @param {Object} tab 
   * @param {integer} index 
   * @returns 
   * @memberof TabsComponent
   */
  drawTabHeader(tab,index){
    return (
      <li key={index} className={tab.active ? 'active' : ""}><a data-toggle="tab" href={"#"+tab.divId}>{tab.name}</a></li>
    );
  }

  /**
   * This method performs a search
   * 
   * @param {Object} queryDetails the search query
   * @param {string} [description=""] 
   * @returns 
   * @memberof TabsComponent
   */
  search(queryDetails, description = "") {
    const apiHelper = new ApiHelper(null);
    const { getHistory } = this.props;
    const searchResult = new Promise(function(resolve, reject) {
      apiHelper.post('reportingrest/adhocquery?v=full', queryDetails.query).then(response => {
        response.json().then(data => {
          data.searchDescription = description || queryDetails.label;
          data.query = queryDetails.query;
          getHistory(data, data.searchDescription);
          resolve(data);
        });
      });
    });
    return searchResult;
  }

  /**
   * This method fetches data from a URL
   * 
   * @param {String} url the url
   * @returns 
   * @memberof TabsComponent
   */
  fetchData(url) {
    const apiHelper = new ApiHelper(null);
    const getData = new Promise(function(resolve, reject) {
      apiHelper.get(url).then(response => {
        response.json().then(data => {
          resolve(data);
          //TODO: This errors need to be handled
        }).catch((error) => error);
      }).catch(error => error);
    });
    return getData;
  }

  /**
   * This method renders the TabsComponent component
   * 
   * @returns 
   * @memberof TabsComponent
   */
  render(){
    const { getHistory } = this.props; 
    
    return (
      <div className="col-sm-12 section">
        <TabBarComponent tabs={this.state.tabs} drawTabHeader={this.drawTabHeader} />
        <TabContentComponent
            tabs={this.state.tabs}
            search={this.search}
            fetchData={this.fetchData}
            addToHistory={this.props.addToHistory}
            getHistory={getHistory}
        />
      </div>
    );
  }
}

/**
 * Proptype validation for the TabsComponent component
 */
TabsComponent.propTypes = {
  getHistory : PropTypes.func,
  addToHistory: PropTypes.func,
};

export default TabsComponent;
