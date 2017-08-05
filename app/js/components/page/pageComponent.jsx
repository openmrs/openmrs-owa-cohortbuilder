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

import React, {Component ,PropTypes } from 'react';
import TabsComponent from '../tabs/tabsComponent';
import SearchHistoryTab from '../searchHistory/searchHistoryTab.jsx';
import './pageComponent.css';

/**
 * The PageComponent Component class
 * 
 * @class PageComponent
 * @extends {Component}
 */
class PageComponent extends Component{

  /**
   * Creates an instance of PageComponent.
   * @param {Object} props 
   * @memberof PageComponent
   */
  constructor(props) {
    super(props);
    this.state = {
      history: []
    };
    this.addToHistory = this.addToHistory.bind(this);
    this.deleteHistory = this.deleteHistory.bind(this);
    this.updateStateHistory = this.updateStateHistory.bind(this);
  }

  /**
   * This method runs when the component has rendered.
   * It checks if there are any search history in the local storage
   * and updates it.
   * 
   * @memberof PageComponent
   */
  componentDidMount() {
    const currentHistory = JSON.parse(window.sessionStorage.getItem('openmrsHistory'));
    if(currentHistory) {
      this.updateStateHistory(currentHistory);
    }
  }

  /**
   * deleteHistory is used to remove a search history from the sessionStorage
   * @param {int} index 
   */
  deleteHistory(index) {
    const currentHistory = [...this.state.history];
    currentHistory.splice(index, 1);
    window.sessionStorage.setItem('openmrsHistory', JSON.stringify(currentHistory));
    this.updateStateHistory(currentHistory);
  }

  /**
   * Function is used to add to search history
   * 
   * @param {string} description - it describes the search that was performed
   * @param {object} patients - the results of the search
   * @param {object} parameters - the jsonbody that was used posted to the reportingrest/adhocquery endpoint
   */
  addToHistory(description, patients, parameters) {
    const newHistory = [{ description, patients, parameters }, ...this.state.history];
    window.sessionStorage.setItem('openmrsHistory', JSON.stringify(newHistory));
    this.updateStateHistory(newHistory);
  }

  /**
   * Function to update history property in the component state
   * 
   * @param {Array} history - new array containing history to be set in the component state
   * @return {undefined} - returns undefined
   */
  updateStateHistory(history) {
    this.setState({ history });
  }

  /**
   * This method renders the component
   * 
   * @returns 
   * @memberof PageComponent
   */
  render(){
    return(
      <div id="body-wrapper" className="page-wrapper">
          <TabsComponent 
              addToHistory={this.addToHistory} 
              getHistory = {this.props.getHistory} />
          <SearchHistoryTab 
              history={this.state.history} 
              deleteHistory={this.deleteHistory} 
              getHistory = {this.props.getHistory} />
      </div>
    );
  }
}

/**
 * Proptype validation for the PageComponent component
 */
PageComponent.propTypes = {
  getHistory: PropTypes.func
};

export default PageComponent;
