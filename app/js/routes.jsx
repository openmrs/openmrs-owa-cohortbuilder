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
import React from 'react'
import {Route} from 'react-router'
import App from './components/App'

export default (store) => {
  // combine store and onEnter if you need to fire an action when going to a route. Example:
  //   onEnter={ (nextState) => {store.dispatch(loadPatientAction(nextState.params.patientUuid)} }

  return (
    <Route path="/" component={App}>
    </Route>
  );
}
