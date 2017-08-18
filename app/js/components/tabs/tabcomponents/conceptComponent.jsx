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


class ConceptComponent extends Component {
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
      conceptObject: {}
    };
    this.resultsPerPage = 10;
    this.allConcepts = [];
    this.setConcept = this.setConcept.bind(this);
    this.loadConcepts = this.loadConcepts.bind(this);
    this.setLabelKey = this.setLabelKey.bind(this);
  }

  /**
   * Check if verbose is clicked and set verbose state to true
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
   * Load concepts suggestions from the backend based on entered input
   * entered keyword
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
          allConcepts = data.results.map(concept => {
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

  /**
   * setConcept set concept object
   * @param {*} concept 
   */
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
      // display search results based on the value of selectedConcept
      <div>                   
          <div className="col-sm-6 col-sm-offset-3 custom-typehead">  
            <AsyncTypeahead
              labelKey={this.setLabelKey}
              onSearch= {this.loadConcepts}
              options={this.state.conceptsResults}
              placeholder="search concepts"
              onChange={this.setConcept}
              useCache={false}
              paginate
            />
          </div>
          {(this.state.selectedConcept)
            ? <ObservationComponent search={this.props.search} addToHistory={this.props.addToHistory} concept={this.state.conceptObject} />
            : null
          }
      </div>
    );
  }
}

ConceptComponent.propTypes = {
  search: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  addToHistory: React.PropTypes.func.isRequired
};

export default ConceptComponent;
