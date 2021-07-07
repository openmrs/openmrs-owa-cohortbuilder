/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, {Component} from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import ObservationComponent from './observationComponent';


class ConditionComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conceptsResults: [],
      searchResults: [],
      verbose: false,
      pages: [],
      currentPage: 0,
      currentDisplay: [],
      selectedConcept: null,
      conceptObject: {},
      markHide: props.markHide,
    };
    this.resultsPerPage = 10;
    this.allConcepts = [];
    this.setConcept = this.setConcept.bind(this);
    this.loadConcepts = this.loadConcepts.bind(this);
    this.setLabelKey = this.setLabelKey.bind(this);
  }

  /**
   * Checks if verbose is clicked and set verbose state to true
   * @param {*} event 
   */
  checkVerbose(uuid) {
    return () => {
      this.setState({
        verbose: uuid
      });
    };
  }
    
  /**
   * Loads concept's(condition) suggestions from the backend based on entered input
   * @param {*} event 
   */
  loadConcepts(value) {
    this.setState({
      selectedConcept: null
    });
    const conceptName = value.toLowerCase();
    if (conceptName.length > 0) {
      this.props.fetchData(`/concept?v=full&q=${conceptName}`).then(data => {
        let allConcepts = [];
        if (data.results.length > 0 ) {
          const conditions = data.results.filter(condition => condition.conceptClass.uuid == '8d4918b0-c2cc-11de-8d13-0010c6dffd0f'||condition.conceptClass.uuid == '8d492954-c2cc-11de-8d13-0010c6dffd0f' || condition.conceptClass.uuid == '8d491a9a-c2cc-11de-8d13-0010c6dffd0f' || condition.conceptClass.uuid == '8d492b2a-c2cc-11de-8d13-0010c6dffd0f');
          allConcepts = conditions.map(concept => {
            const description= concept.descriptions.filter(des => des.locale == 'en' ? des.description: '');
            const conceptData = {
              uuid: concept.uuid,
              units: concept.units || '',
              answers: concept.answers,
              hl7Abbrev: concept.datatype.hl7Abbreviation,
              name: concept.name.name,
              description: description.length > 0? description[0].description : 'no description available',
              datatype: concept.datatype
            };
            return conceptData;
          }); 
        }
        this.setState({conceptsResults: allConcepts });
      });
    }   
  }

  setConcept(concepts) {
    const concept = concepts[0];
    concept ? 
      this.setState({
        selectedConcept: concept.name,
        conceptObject: concept
      }) : null;
  }

  setLabelKey(option) {
    return option.name;
  }

  render() {
    return (
      <div> 
        <label style={{position: 'absolute', left: '170px', top: '90px'}}>Condition: </label>                   
        <div className="col-sm-6 col-sm-offset-3 custom-typehead">  
          <AsyncTypeahead
            labelKey={this.setLabelKey}
            onSearch= {this.loadConcepts}
            options={this.state.conceptsResults}
            placeholder="search conditions"
            onChange={this.setConcept}
            useCache={false}
            paginate
          />
        </div>
        {(this.state.selectedConcept)
          ? <ObservationComponent search={this.props.search} addToHistory={this.props.addToHistory} concept={this.state.conceptObject} markHide={this.state.markHide}/>
          : null
        }
      </div>
    );
  }
}

ConditionComponent.propTypes = {
  search: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  addToHistory: React.PropTypes.func.isRequired
};

export default ConditionComponent;
