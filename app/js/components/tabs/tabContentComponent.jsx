/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { PropTypes } from 'react';

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
   * @param {Function} getHistory
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
  
  render(){
    const {tabs, fetchData, search, addToHistory, getHistory } = this.props;
    return (
      <div className="tab-content">
          {this.drawComponent(tabs, fetchData, search, addToHistory, getHistory)}
      </div>
    );
  }
}

TabContentComponent.propTypes = {
  tabs: PropTypes.array.isRequired,
  fetchData: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  getHistory: PropTypes.func.isRequired,
  addToHistory: PropTypes.func
};

export default TabContentComponent;
