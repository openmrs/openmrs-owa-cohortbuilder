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
import {Header} from './common/Header';
import PageComponent from './page/pageComponent';
import BreadCrumbComponent from './breadCrumb/breadCrumbComponent';
import CohortTable from '../components/common/table';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      description: "",
      display: 'block',
      table: 'none'
    };
    this.getHistory = this.getHistory.bind(this);
    this.setHistory = this.setHistory.bind(this);
    this.back = this.back.bind(this);
  }

  back() {
    this.setState({
      table: 'none',
      display: 'block'
    });
  }

  setHistory(data) {
    this.setState({ 
      history : data.rows || data.patients
    });
  }

  getHistory(data, description = "") {
    this.setState({ 
      description: description || data.searchDescription,
      display: 'block',
      table: 'none'
    });
  }
 
  render() {
    const { display, table, history, description , getHistory, setHistory } = this.state;
    return (
      <div>
        <div 
          id="tabbed-cohort" style={{display}}>
          <Header/>
          <BreadCrumbComponent/>
          <PageComponent getHistory = {this.getHistory} setHistory = {this.setHistory} />
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
