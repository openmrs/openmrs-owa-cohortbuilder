/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { Component,PropTypes } from 'react';

import Components from './tabcomponents';
import TabBarComponent from './tabBarComponent';
import TabContentComponent from './tabContentComponent';
import { ApiHelper } from '../../helpers/apiHelper';
import { JSONHelper } from '../../helpers/jsonHelper';

import './tabs.css';

class TabsComponent extends Component {
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

  drawTabHeader(tab,index){
    return (
      <li key={index} className={tab.active ? 'active' : ""}><a data-toggle="tab" href={"#"+tab.divId}>{tab.name}</a></li>
    );
  }


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

  render(){
    const { getHistory } = this.props; 
    
    return (
      <div className="main-section">
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

TabsComponent.propTypes = {
  getHistory : PropTypes.func,
  addToHistory: PropTypes.func,
};

export default TabsComponent;
