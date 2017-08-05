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
 * This method renders the Navigate component that 
 * displays the pagination
 * 
 * @param {Integer} currentPage 
 * @param {Integer} totalPage 
 * @param {Integer} navigatePage 
 */
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

/**
 * Proptype validation for the Navigate component
 */
Navigate.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPage: PropTypes.number.isRequired,
  navigatePage: PropTypes.func.isRequired
};
