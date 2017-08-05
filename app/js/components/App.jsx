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
import {Header} from './common/Header';
import PageComponent from './page/pageComponent';
import BreadCrumbComponent from './breadCrumb/breadCrumbComponent';
import CohortTable from '../components/common/table';

/**
 * The App Component class
 * 
 * @class App
 * @extends {Component}
 */
class App extends Component {

  /**
   * Creates an instance of App.
   * @param {any} props 
   * @memberof App
   */
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      description: "",
      display: 'block',
      table: 'none'
    };
    this.getHistory = this.getHistory.bind(this);
    this.back = this.back.bind(this);
  }

  /**
   * This method updates the component main state
   * 
   * @memberof App
   */
  back() {
    this.setState({
      table: 'none',
      display: 'block'
    });
  }

  /**
   * This method updates the component main state
   * 
   * @param {Object} data 
   * @param {string} [description=""] 
   * @memberof App
   */
  getHistory(data, description = "") {
    this.setState({ 
      history : data.rows || data.patients,
      description: description || data.searchDescription,
      display: 'none',
      table: 'block'
    });
  }
 
  /**
   * This method displays the App component
   * 
   * @returns 
   * @memberof App
   */
  render() {
    const { display, table, history, description , getHistory } = this.state;
    return (
      <div>
          <div 
            id="tabbed-cohort" style={{display}}>
            <Header/>
            <BreadCrumbComponent/>
            <PageComponent getHistory = {this.getHistory} />
          </div>

          <div id="body-wrapper" 
            style={{display :table}}>
            <div id="displayTable"  className="col-md-12 section">
                <CohortTable
                  toDisplay = {history}
                  description = {description}
                  back={this.back}
                />
            </div>
          </div>
      </div>
    );
  }
}

export default App;
