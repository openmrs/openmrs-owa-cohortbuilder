export class XmlHelper {
  composeXml(searchParameters) {
    let xml = '';
    for(let field in searchParameters) {
      if(searchParameters[field]) {
         xml += `<definitionKey>${this.getDefinitionLibraryKey(field, searchParameters[field])}</definitionKey>`;
      }
    }

    return `<org.openmrs.module.reporting.cohort.definition.DefinitionLibraryCohortDefinition>${xml}</org.openmrs.module.reporting.cohort.definition.DefinitionLibraryCohortDefinition>`;
  }

  getDefinitionLibraryKey(field, value) {
    let definitionLibraryKey = 'reporting.library.cohortDefinition.builtIn';
    switch(field) {
      case 'gender': definitionLibraryKey += `.${value}`; break;
    }

    return definitionLibraryKey;
  }
}