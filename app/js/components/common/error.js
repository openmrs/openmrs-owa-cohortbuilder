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
 * This methods renders the content of the `message` props
 * @param {String} message The message props 
 */
const Loader = ({message}) => {
  return(
    <div>
      <p className="text-center text-danger">{message}</p>
    </div>
  );
};

/**
 * Proptype validation for the Loader component
 */
Loader.propTypes = {
  message: PropTypes.string.isRequired
};

export default Loader;
