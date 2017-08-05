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

import React, {Component} from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import ObservationComponent from './observationComponent';

/**
 * The ConceptComponent Component class
 * 
 * @class ConceptComponent
 * @extends {Component}
 */
class ConceptComponent extends Component {

  /**
   * Creates an instance of ConceptComponent.
   * @param {Object} props 
   * @memberof ConceptComponent
   */
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
   * 
   * @param {Number} uuid the primary key
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
   * 
   * @param {String} value 
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
   * 
   * @param {Array} concept the concepts
   */
  setConcept(concepts) {
    const concept = concepts[0];
    concept ? 
        this.setState({
          selectedConcept: concept.name,
          conceptObject: concept
        }) : null;
  }

  /**
   * This method sets the label key
   * 
   * @param {Object} option 
   * @returns 
   * @memberof ConceptComponent
   */
  setLabelKey(option) {
    return option.name;
  }

  /**
   * This method displays the ConceptComponent component
   * 
   * @returns 
   * @memberof ConceptComponent
   */
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

/**
 * Proptype validation for the ConceptComponent class
 */
ConceptComponent.propTypes = {
  search: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  addToHistory: React.PropTypes.func.isRequired
};

export default ConceptComponent;
