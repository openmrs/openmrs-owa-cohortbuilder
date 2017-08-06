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

export  const Navigate = ({currentPage, totalPage, navigatePage}) => {
  return(
        <div className="tableNavigation">
            <button className="btn btn-primary" onClick={navigatePage} value="first">FIRST</button>
            {
                (currentPage > 1) ?
                    <button className="btn btn-primary" onClick={navigatePage} value="previous">PREVIOUS</button> :
                    null
            }

            {
                (currentPage < totalPage) ?
                    <span>
                        <button className="btn btn-primary" onClick={navigatePage} value="next">NEXT</button>
                        <button className="btn btn-primary" onClick={navigatePage} value="last">LAST</button>
                    </span> :
                    null
            }
            <span className="page-display-counter">{currentPage + " of " + totalPage}</span>
        </div>
     );
};

Navigate.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPage: PropTypes.number.isRequired,
  navigatePage: PropTypes.func.isRequired
};
