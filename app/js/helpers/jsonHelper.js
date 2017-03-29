export class JSONHelper {
  composeJson(searchParameters) {
    const query = {};
    query.type = "org.openmrs.module.reporting.dataset.definition.PatientDataSetDefinition";
    query.columns = this.addColumnsToDisplay();
    let counter = 0;
    query.rowFilters = [];
    for(let field in searchParameters) {
      if(this.isNullValues(searchParameters[field])) {
        continue;
      }
      if(searchParameters[field] != 'all' && searchParameters != '') {
        query.rowFilters[counter] = {};
        query.rowFilters[counter].key = this.getDefinitionLibraryKey(field, searchParameters[field]);
      }
      if(Array.isArray(searchParameters[field])) {
        query.rowFilters[counter].parameterValues = this.getParameterValues(searchParameters[field]);
      }
      query.rowFilters[counter].type = "org.openmrs.module.reporting.dataset.definition.PatientDataSetDefinition";
      counter += 1;
    }
    query.customRowFilterCombination = this.composeFilterCombination(query.rowFilters);
    return query;
  }

  isNullValues(fieldValues) {
    if(Array.isArray(fieldValues)) {
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
      compositionTitle += `${index}`;
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
