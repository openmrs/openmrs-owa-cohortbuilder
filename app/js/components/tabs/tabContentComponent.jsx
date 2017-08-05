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

import React, { PropTypes } from 'react';

/**
 * This is the tabContent class
 * @param {*} props 
 */
class TabContentComponent extends React.Component{
  constructor(props){
    super(props);
    this.drawComponent = this.drawComponent.bind(this);
  }

  /**
   * This method designs the tab component content
   *
   * @param {Array} tabs This is an array of all the tabs to be displayed 
   * @param {Function} fetchData
   * @param {Function} search
   * @param {Function} addToHistory
   * @param {Funcnpption} getHistory
   */
  drawComponent(tabs, fetchData, search, addToHistory, getHistory) {
    return tabs.map((tab,index) => {
      return(
        <div id={tab.divId} key={index} className={'tab-pane ' + (tab.active ? 'active' : '')}>
            <tab.component fetchData={fetchData} search={search} addToHistory={addToHistory} getHistory={getHistory} />
        </div>
      );
    });
  }
  
  /**
   * This method renders the TabContentComponent component
   * 
   * @returns 
   * @memberof TabContentComponent
   */
  render(){
    const {tabs, fetchData, search, addToHistory, getHistory } = this.props;
    return (
      <div className="tab-content">
          {this.drawComponent(tabs, fetchData, search, addToHistory, getHistory)}
      </div>
    );
  }
}

/**
 * Proptype validation for the TabContentComponent component
 */
TabContentComponent.propTypes = {
  tabs: PropTypes.array.isRequired,
  fetchData: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  getHistory: PropTypes.func.isRequired,
  addToHistory: PropTypes.func
};

export default TabContentComponent;
