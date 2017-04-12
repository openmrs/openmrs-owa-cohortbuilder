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
      if (searchParameters[field][0].livingStatus === 'alive') {
        query.rowFilters[counter].livingStatus = 'alive';
      }
      query.rowFilters[counter].type = "org.openmrs.module.reporting.dataset.definition.PatientDataSetDefinition";
      counter += 1;
    }
    query.customRowFilterCombination = this.composeFilterCombination(query.rowFilters);
    const label = this.composeDescription(searchParameters);
    return {query, label};
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
      }
    ];

    const colValues = columns.map((aColumn) => {
      aColumn.type = "org.openmrs.module.reporting.data.patient.definition.PatientDataDefinition";
      aColumn.key = `reporting.library.patientDataDefinition.builtIn.${aColumn.key}`;
      return aColumn;
    });
    return colValues;
  }
  
  composeDescription(searchParameters) {
    let definitionKeys = Object.keys(searchParameters);
    if(definitionKeys.length === 0) {
      return 'All Patients';
    } else {
      let label = '';
      if (definitionKeys.indexOf('gender') >= 0) {
        label = `${this.getGenderName(searchParameters['gender'])} patients`;
        delete searchParameters.gender;
        definitionKeys = Object.keys(searchParameters);
      } else {
        label = 'Patients';
      }
      let counter = 0;
      for(let eachKey in searchParameters) {
        if(counter === 0) {
          if (eachKey !== 'diedDuringPeriod')
            label += ' with';
          else
            label += ' that are';
        } else if ((counter > 0) && (counter < definitionKeys.length - 1)) {
          label += ',';
        } else {
          label += ' and';
        }
        label += this.createLabel(eachKey, searchParameters);
        counter++;
      }
      return label;
    }
  }

  createLabel(key, searchParameters) {
    switch(key) {
      case 'upToAgeOnDate': 
        return ` maximum age of ${searchParameters[key][0].value} years`;
      case 'atLeastAgeOnDate': 
        return ` minimum age of ${searchParameters[key][0].value} years`;
      case 'ageRangeOnDate': 
        return ` age between ${searchParameters[key][0].value} & ${searchParameters[key][1].value} years`; 
      case 'bornDuringPeriod': 
        return ` date of birth between ${searchParameters[key][0].value} & ${searchParameters[key][1].value}`;
      case 'personWithAttribute': 
        return ` ${searchParameters[key][0].value} as ${searchParameters[key][1].value}`;
      case 'diedDuringPeriod':
        return searchParameters[key][0].livingStatus === 'alive' ? ' Alive' : ' Dead'
      default : 
        return '';
    }
  }

  getGenderName(gender) {
    return gender.charAt(0).toUpperCase()+gender.slice(1, gender.length-1); 
  }
}
