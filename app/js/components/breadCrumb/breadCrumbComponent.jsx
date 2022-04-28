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
import './breadCrumb.css';

class BreadCrumbComponent extends Component{
  render(){
    return (
      <div className="breadcrumb">
        <a href="/openmrs" className="breadcrumb-item">
          <span className="glyphicon glyphicon-home breadcrumb-item" aria-hidden="true" />
        </a>
        <span 
          className="glyphicon glyphicon-chevron-right breadcrumb-item separator"
          aria-hidden="true"
        />
        <span className="title breadcrumb-item">Cohort Builder</span>
      </div>
    );
  }
}

export default BreadCrumbComponent;
