import React, {Component, PropTypes} from 'react';
import shortId from 'shortid';

const FORMS_API_ENDPOINT = '/form';
const LOCATIONS_API_ENDPOINT = '/location';
const ENCOUNTER_TYPES_API_ENDPOINT = '/encountertype';

class EncounterComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            locations: [],
            encouterTypes: [],
            forms: [],
            searchResults: [],
            currentPage: 1,
            toDisplay: [],
            totalPage: 0,
            perPage: 10
        };
        this.searchByEncounter = this.searchByEncounter.bind(this);
        this.getFormValues = this.getFormValues.bind(this);
    }

    componentWillMount(){
        this.props.fetchData(FORMS_API_ENDPOINT)
          .then(response => {
              const displayData = [];
              response.results.map(result=>{
                  displayData.push({id: result.uuid, value: result.display});
              });
              this.setState({forms: displayData});
          });

        this.props.fetchData(LOCATIONS_API_ENDPOINT)
          .then(response => {
              const displayData = [];
              response.results.map(result=>{
                  displayData.push({id: result.uuid, value: result.display});
              });
              this.setState({locations: displayData});
          });

        this.props.fetchData(ENCOUNTER_TYPES_API_ENDPOINT)
          .then(response => {
              const displayData = [];
              response.results.map(result=>{
                  displayData.push({id: result.uuid, value: result.display});
              });
              this.setState({encouterTypes: displayData});
          });
    }

    displaySelectOption(data){
        return (
            <option value={data.id} key={shortId.generate()}>{data.value}</option>
        );
    }

    getFormValues(fields) {
      const searchParams = {};
      for(const eachField in fields) {
        if(Array.isArray(fields[eachField])) {
            fields[eachField].forEach((fieldInput, index) => {
                let fieldValue = $('#encounter-search').find('#'+fieldInput.name).val();
                fields[eachField][index].value = (fields[eachField][index].isArrayValue && fieldValue != '')
                    ? [ fieldValue ]
                    : fieldValue;
            });
            searchParams[eachField] = fields[eachField];
            continue;
        }
      }
      return this.removeEmptyValues(searchParams);
    }

    removeEmptyValues(allParameters) {
        const newParamArray = [];
        allParameters.encounterSearchAdvanced.forEach(eachParam => {
            if(!(!eachParam.value || (Array.isArray(eachParam.value) && eachParam.value[0] === ''))) {
                newParamArray.push(eachParam);
            }
        });

        const newObject = {};
        newObject.encounterSearchAdvanced = newParamArray;
        return newObject;
    }

    searchByEncounter(event) {
      event.preventDefault();
      const fields = {
          encounterSearchAdvanced : [
              { name: 'encounterTypeList'},
              { name: 'locationList', isArrayValue: true },
              { name: 'formList', isArrayValue: true },
              { name: 'atLeastCount' },
              { name: 'atMostCount' },
              { name: 'onOrAfter' },
              { name: 'onOrBefore' }
          ]
      };

      const searchParams = this.getFormValues(fields);
      const label = this.composeLabel(searchParams.encounterSearchAdvanced);
      this.props.search(searchParams).then(results => {
          const allEncounterTypes = results.rows || [];
          this.props.addToHistory(label, allEncounterTypes, results.query);
      });
    }

    /**
     * composeLabel will compose the right description for every search that is performed
     * @param {object} searchParameter 
     * @return {string} the label
     */
    composeLabel(searchParameters) {
        const parameters = [...searchParameters];
        let label = 'Patients with encounter(s)';
        parameters.forEach(aParameter => {
            let theFieldValue = $('#encounter-search').find('#'+aParameter.name).val();
            if($('#encounter-search').find('#'+aParameter.name).prop("tagName") === 'SELECT') {
                aParameter.displayValue = $('#encounter-search').find('option[value='+theFieldValue+']').text();
            } else {
                aParameter.displayValue = theFieldValue;
            }
            if(aParameter.displayValue != '') {
                switch(aParameter.name) {
                case 'encounterTypeList':
                    label += ` of type(s) ${aParameter.displayValue}`; break;
                case 'locationList':
                    label += ` at ${aParameter.displayValue}`; break;
                case 'formList':
                    label += ` from ${aParameter.displayValue}`; break;
                case 'atLeastCount':
                    label += ` at least ${aParameter.displayValue} ${aParameter.displayValue > 1 ? 'times' : 'time'}`; break;
                case 'atMostCount':
                    label += ` at most ${aParameter.displayValue} ${aParameter.displayValue > 1 ? 'times' : 'time'}`; break;
                case 'onOrAfter':
                    label += ` from ${aParameter.displayValue}`; break;
                case 'onOrBefore':
                    label += ` to ${aParameter.displayValue}`; break;
                }
            }
        });
        return label;
    }

    render(){
        return (
            <div className="encounter-component">
              <h3>Search By Encounter</h3>
              <div>
                <h4 className="text-center">Patients having encounters</h4>
                <form className="form-horizontal text-center" id="encounter-search">
                  <div className="form-group">
                    <label htmlFor="type" className="col-sm-2 control-label">
                      Of Type
                    </label>
                    <div className="col-sm-6">
                      <select multiple="multiple" name="encounterTypes" id="encounterTypeList" className="form-control">
                        <option value="">--Any Encounter--</option>
                        {this.state.encouterTypes.map(encounterType => this.displaySelectOption(encounterType))}
                      </select>
                      { }
                    </div>
                    <span className="inline-label">(Leave blank for all encounter types)</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="locations" className="col-sm-2 control-label">At Location</label>
                    <div className="col-sm-3">
                        <select className="form-control" id="locationList">
                            <option value="">--Select Location--</option>
                            {this.state.locations.map(location => this.displaySelectOption(location))}
                        </select>
                    </div>
                    <span className="inline-label">(Optional)</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="forms" className="col-sm-2 control-label">From Form</label>
                    <div className="col-sm-3">
                        <select className="form-control" id="formList">
                            <option value="">--Select Form--</option>
                            {this.state.forms.map(form => this.displaySelectOption(form))}
                        </select>
                    </div>
                    <span className="inline-label">(Optional)</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="atLeast" className="col-sm-2 control-label">Atleast this many: </label>
                    <div className="col-sm-3">
                        <input type="number" className="form-control" id="atLeastCount"/>
                    </div>
                    <label htmlFor="atMost" className="col-sm-2 control-label">Upto this many: </label>
                    <div className="col-sm-3">
                        <input type="number" className="form-control" id="atMostCount"/>
                    </div>
                    <span className="inline-label">(Optional)</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="startDate" className="col-sm-2 control-label">From: </label>
                    <div className="col-sm-3">
                       <input type="date" className="form-control" id="onOrAfter"/>
                    </div>
                    <label htmlFor="endDate" className="col-sm-2 control-label">To: </label>
                    <div className="col-sm-3">
                        <input type="date" className="form-control" id="onOrBefore"/>
                    </div>
                    <span className="inline-label">day(s)    (Optional)</span>
                  </div>

                  <div className="form-group submit-btn">
                    <div className="col-sm-offset-2 col-sm-6">
                      <button type="submit" className="btn btn-success" onClick={this.searchByEncounter}>Search</button>
                    </div>
                  </div>
                </form>
                <hr/>
              </div>
            </div>
        );
    }
}

EncounterComponent.propTypes = {
    fetchData: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    addToHistory: PropTypes.func.isRequired
};

export default EncounterComponent;
