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
import {Link} from 'react-router';
import './breadCrumb.css';

/**
 * The BreadCrumb Component class
 * 
 * @class BreadCrumbComponent
 * @extends {Component}
 */
class BreadCrumbComponent extends Component{

  /**
   * The componentDidMount method
   * 
   * @memberof BreadCrumbComponent
   */
  componentDidMount(){}

  /**
   * This method renders the component
   * 
   * @returns {Object} jsx component
   * @memberof BreadCrumbComponent
   */
  render(){
    return (
      <div className="breadcrumb">
        <a href="/openmrs" className="breadcrumb-item">
          <span className="glyphicon glyphicon-home breadcrumb-item" aria-hidden="true" />
        </a>
        <span className="glyphicon glyphicon-chevron-right breadcrumb-item separator"
              aria-hidden="true" />
        <span className="title breadcrumb-item">Cohort Builder</span>
      </div>
    );
  }
}

export default BreadCrumbComponent;
