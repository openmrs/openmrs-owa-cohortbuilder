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

import React, {PropTypes} from 'react';

/**
 * This method renders the TabBarComponent
 * @param {Object} props the props
 */
const TabBarComponent = (props) => {
  return (
    <div>
        <ul className="nav nav-tabs">
          {props.tabs.map(props.drawTabHeader)}
        </ul>
    </div>
  );
};


/**
 * Proptype validation for the TabBarComponent component
 */
TabBarComponent.propTypes = {
  tabs: PropTypes.array.isRequired,
  drawTabHeader: PropTypes.func.isRequired
};

export default TabBarComponent;
