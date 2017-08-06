/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, {PropTypes} from 'react';

const TabBarComponent = (props) => {
  return (
    <div>
        <ul className="nav nav-tabs">
          {props.tabs.map(props.drawTabHeader)}
        </ul>
    </div>
  );
};

TabBarComponent.propTypes = {
  tabs: PropTypes.array.isRequired,
  drawTabHeader: PropTypes.func.isRequired
};

export default TabBarComponent;
