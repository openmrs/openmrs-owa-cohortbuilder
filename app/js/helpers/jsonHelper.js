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

/**
 * The JSONHelper class
 * 
 * @export
 * @class JSONHelper
 */
export class JSONHelper {

  /**
   * The composeJson method
   * 
   * @param {Object} searchParameters 
   * @returns 
   * @memberof JSONHelper
   */
  composeJson(searchParameters) {
    const query = {};
    query.type = "org.openmrs.module.reporting.dataset.definition.PatientDataSetDefinition";
    query.columns = this.addColumnsToDisplay();
    let counter = 0;
    query.rowFilters = [];
    for(let field in searchParameters) {
      if(this.isNullValues(searchParameters[field])) {
        delete searchParameters[field];
        continue;
      }
      if(searchParameters[field] != 'all' && searchParameters != '') {
        query.rowFilters[counter] = {};
        query.rowFilters[counter].key = this.getDefinitionLibraryKey(field, searchParameters[field]);
      }
      if(Array.isArray(searchParameters[field])) {
        query.rowFilters[counter].parameterValues = this.getParameterValues(searchParameters[field]);
      }
      // add living status property so we can append a NOT to the filter combination
      if (searchParameters[field].length >= 1 && searchParameters[field][0].livingStatus === 'alive') {
        query.rowFilters[counter].livingStatus = 'alive';
      }
      query.rowFilters[counter].type = "org.openmrs.module.reporting.dataset.definition.PatientDataSetDefinition";
      counter += 1;
    }
    query.customRowFilterCombination = this.composeFilterCombination(query.rowFilters);
    return {query};
  }

  /**
   * The isNullValues method
   * 
   * @param {Object} fieldValues 
   * @returns 
   * @memberof JSONHelper
   */
  isNullValues(fieldValues) {
    if(Array.isArray(fieldValues) && fieldValues.length >= 1) {
      return (!fieldValues[0].value) ? true : false;
    }
    return (fieldValues === 'all' || !fieldValues) ? true : false;
  }

  /**
   * The getDefinitionLibraryKey method
   * 
   * @param {String} field 
   * @param {String} value 
   * @returns 
   * @memberof JSONHelper
   */
  getDefinitionLibraryKey(field, value) {
    let definitionLibraryKey = 'reporting.library.cohortDefinition.builtIn';
    switch (field) {
      case 'gender':
        definitionLibraryKey += `.${value}`;
        break;
      default:
        definitionLibraryKey += `.${field}`;
    }
    return definitionLibraryKey;
  }

  /**
   * The getParameterValues method
   * 
   * @param {Array} parameterFields 
   * @returns 
   * @memberof JSONHelper
   */
  getParameterValues(parameterFields) {
    const parameter = {};
    parameterFields.forEach(eachParam => {
      parameter[eachParam.name] = eachParam.value;
    });
    return parameter;
  }

  /**
   * The composeFilterCombination method
   * 
   * @param {Object} filterColumns 
   * @returns 
   * @memberof JSONHelper
   */
  composeFilterCombination(filterColumns) {
    let compositionTitle = '';
    const totalNumber = filterColumns.length;
    for (let index = 1; index <= totalNumber; index++) {
      if (filterColumns[index - 1].livingStatus === 'alive') {
        compositionTitle += `NOT ${index}`;
        // delete helper living status property
        delete filterColumns[index - 1].livingStatus;
      } else {
        compositionTitle += `${index}`;
      }
      compositionTitle += (index < totalNumber) ? ' AND ' : '';
    }
    return compositionTitle;
  }

  /**
   * The addColumnsToDisplay method
   * 
   * @returns 
   * @memberof JSONHelper
   */
  addColumnsToDisplay() {
    // the constant columns should not be hardcoded, at the longrun, users should be able to select the columns
    // they want displayed on the result table
    const columns = [
      {
        name: "firstname",
        key: "preferredName.givenName"
      },
      {
        name: "lastname",
        key: "preferredName.familyName"
      },
      {
        name: "gender",
        key: "gender"
      },
      {
        name: "age",
        key: "ageOnDate.fullYears"
      },
      {
        name: "patientId",
        key: "patientId"
      }		        
    ];

    const colValues = columns.map((aColumn) => {
      aColumn.type = "org.openmrs.module.reporting.data.patient.definition.PatientDataDefinition";
      aColumn.key = `reporting.library.patientDataDefinition.builtIn.${aColumn.key}`;
      return aColumn;
    });
    return colValues;
  }
}
