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
import shortId from 'shortId';

const savedCohorts = ({allCohort = []}) => {
  return (
    <div className="col-md-10 col-md-offset-1 ">
      <h3 className="text-center">All Saved Cohorts</h3>
      <div className="cohort-view">
          { (allCohort.length > 0) ?
          <table className="table table-hover">
              <thead>
                  <tr>
                      <th>S/N</th>
                      <th>Display</th>
                      <th>Description</th>
                      <th className="row-icon">Download</th>
                      <th className="row-icon">Delete</th>
                      <th className="row-icon">View</th>
                  </tr>
              </thead>
              <tbody>
                  { this.state.allCohort.map((cohort, index) =>
                  (<tr key={shortId.generate()}>
                      <td>{index + 1}</td>
                      <td>{ cohort.display }</td>
                      <td>{cohort.description}</td>
                      <td className="row-icon">
                          <span
                              className={`glyphicon ${this.state.downloadJobIds.includes(cohort.uuid) ? 'glyphicon-refresh glyphicon-spin' : 'glyphicon-download download'}`}
                              onClick={this.downloadCSV(cohort.uuid, cohort.description)}
                              title="Download"
                              aria-hidden="true"
                          />
                      </td>
                      <td className="row-icon">
                          <span
                              className="glyphicon glyphicon-remove remove"
                              onClick={this.deleteCohort(cohort.uuid)}
                              title="Delete"
                              aria-hidden="true"
                          />
                      </td>
                      <td className="row-icon">
                          <span
                              className="glyphicon glyphicon-eye-open view"
                              onClick={this.getPatientsData(cohort.uuid, cohort.description)}
                              title="View"
                              aria-hidden="true"
                          />
                      </td>
                  </tr>)
                  ) }
              </tbody>
          </table> :
          <p className="text-center">No saved cohort</p>
          }
      </div>
    </div>
  );
};

savedCohorts.propTypes = {
  allCohort : PropTypes.array
};
