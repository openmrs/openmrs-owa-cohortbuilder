/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

export class JSONHelper {
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

  isNullValues(fieldValues) {
    if(Array.isArray(fieldValues) && fieldValues.length >= 1) {
      return (!fieldValues[0].value) ? true : false;
    }
    return (fieldValues === 'all' || !fieldValues) ? true : false;
  }

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

  getParameterValues(parameterFields) {
    const parameter = {};
    parameterFields.forEach(eachParam => {
      parameter[eachParam.name] = eachParam.value;
    });
    return parameter;
  }

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
