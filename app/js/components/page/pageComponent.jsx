/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, {Component ,PropTypes } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import TabsComponent from '../tabs/tabsComponent';
import SearchHistoryTab from '../searchHistory/searchHistoryTab.jsx';
import './pageComponent.css';
import 'react-confirm-alert/src/react-confirm-alert.css'

class PageComponent extends Component{
  constructor(props) {
    super(props);
    this.state = {
      history: []
    };
    this.addToHistory = this.addToHistory.bind(this);
    this.deleteHistory = this.deleteHistory.bind(this);
    this.clearSearchHistory = this.clearSearchHistory.bind(this);
  }

  componentDidMount() {
    const currentHistory = JSON.parse(window.sessionStorage.getItem('openmrsHistory'));
    if(currentHistory) {
      this.updateStateHistory(currentHistory);
    }
  }

  /**
   * Removes search history item from the sessionStorage
   * @param {int} index 
   */
  deleteHistory(index) {
    const currentHistory = [...this.state.history];
    currentHistory.splice(index, 1);
    window.sessionStorage.setItem('openmrsHistory', JSON.stringify(currentHistory));
    this.updateStateHistory(currentHistory);
  }

  /**
   * Adds  item to search history
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
   * Clears all saved searches by deleting them from session storage
   * @return {void} void
   * @memberof SearchHistoryComponent
   */
  clearSearchHistory() {
    const options = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete your saved Search History',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {window.sessionStorage.removeItem('openmrsHistory'); this.updateStateHistory([]);}
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ],
    }

    confirmAlert(options);
  }

  /**
   * Updates history property in the component state
   * @param {Array} history - new array containing history to be set in the component state
   * @return {Object} - Sets new state
   */
  updateStateHistory(history) {
    this.setState({ history });
  }

  render(){
    return(
      <div id="body-wrapper" className="page-wrapper">
        <TabsComponent 
          addToHistory={this.addToHistory} 
          getHistory = {this.props.getHistory} />
        <SearchHistoryTab 
          history={this.state.history} 
          deleteHistory={this.deleteHistory} 
          getHistory = {this.props.getHistory} 
          clearSearchHistory={this.clearSearchHistory} />
      </div>
    );
  }
}

PageComponent.propTypes = {
  getHistory: PropTypes.func
};

export default PageComponent;
