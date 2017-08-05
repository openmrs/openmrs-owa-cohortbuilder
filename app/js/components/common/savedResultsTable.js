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

import React from 'react';

/**
 * This method renders the SavedResultsTable component
 * that is being displayed when you search for a saved cohort 
 * or saved definition
 * 
 * @param {Array} results the results to be displayed on the table
 * @param {Array} tableName the name of the table
 * @param {Function} downloadJobs the 
 * @param {Function} deleteJobs
 * @param {Function} onDelete the function to handle the deleting of a result
 * @param {Function} onView the function to handle the viewing of a result
 * @param {Function} onDownload the function to handle the downloading of a result
 * @param {Boolean} isSearching a boolean to check if you are searching through the results
 * 
 * @return {Object} JSX The JSX component
 */
const SavedResultsTable = ({
  results, tableName, downloadJobs, deleteJobs,
  onDelete, onView, onDownload, isSearching
}) => {
  return isSearching ? 
    (<div>
      <h4 className="text-center">{tableName}</h4>
      <p>Loading... </p>
    </div>) : 
    (<div className="table-responsive">     
      <h4 className="text-center">{tableName}</h4>
      {results.length <= 0 && !isSearching ?
      null :
      <div className="saved-results-view col-sm-10 col-sm-offset-1">
        {results.length <= 0 ?
        <p> No Results</p> : 
        <table className="table table-hover">
          <thead>
            <tr>
              <th className="table-header">S/N</th>
              <th>Name</th>
              <th>Description</th>
              <th>Number of Patients</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {
              results.map((result, index) => {
                const { uuid, description } = result;
                return (
                  <tr key={uuid}>
                    <td>{index + 1}</td>
                    <td>{result.name}</td>
                    <td>
                      {result.description}
                    </td>
                    <td>
                      {result.totalResults !== undefined ? 
                        <a
                          onClick={onView(uuid, description)}
                          className="link"
                          title="View Patients"
                        >
                          {result.totalResults} Patients
                        </a> : 
                        <a
                          onClick={onView(uuid, description)}
                          className="link"
                          title="View Patients"
                        >
                          View
                        </a>
                      }
                    </td>
                    <td>
                      <a
                        onClick={onDownload(uuid, result.name)}
                        className="link"
                        title="Dowload Patients"
                      >
                        {downloadJobs.includes(uuid) ?
                          'Downloading...': 'Download'}
                      </a>
                      <a
                        onClick={onDelete(uuid, result.name)}
                        className="link"
                        title={`Delete ${result.name}`}
                      >
                        {deleteJobs.includes(uuid) ?
                        'Deleting...' : 'Delete'}
                      </a>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>}
      </div>}
    </div>
  );
};

/**
 * Proptypes validation for SavedResultsTable component
 */
SavedResultsTable.propTypes = {
  results: React.PropTypes.array.isRequired,
  tableName: React.PropTypes.string.isRequired,
  onDelete: React.PropTypes.func.isRequired,
  onDownload: React.PropTypes.func.isRequired,
  onView: React.PropTypes.func.isRequired,
  deleteJobs: React.PropTypes.array.isRequired,
  downloadJobs: React.PropTypes.array.isRequired,
  isSearching: React.PropTypes.bool.isRequired
};

export default SavedResultsTable;
