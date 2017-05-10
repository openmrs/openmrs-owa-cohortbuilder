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
            perPage: 10,
            locationError: false,
            location: '',
            method: 'ANY'
        };
        this.searchByEncounter = this.searchByEncounter.bind(this);
        this.getFormValues = this.getFormValues.bind(this);
        this.handleSelectOption = this.handleSelectOption.bind(this);
        this.searchByLocation = this.searchByLocation.bind(this);
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

    /**
     * Function to generate a location search description based on the search values
     */
    getLocationSearchDescription() {
        // find the location name since we only have it's uuid
        const selectedLocation = this.state.locations.find((item) => {
             return item.id === this.state.location;
        });
        let searchDescription = `Patients in ${selectedLocation.value}`;
        switch (this.state.method) {
            case 'FIRST':
                searchDescription += ' (by method EARLIEST_ENCOUNTER).';
                break;
            case 'LAST': 
                searchDescription += ' (by method LATEST_ENCOUNTER).'; 
                break;
            default :
                searchDescription += ' (by method ANY_ENCOUNTER).';
                break;
        }
        return searchDescription;
    }

    /**
     * Method to handle search by location submit events and search for patients 
     * from the back end using location and method selected
     * @param {Object} event - Object containing data about the triggered event
     * @return {undefined}
     */
    searchByLocation(event) {
        event.preventDefault();
        const selectedLocation = this.state.location;
        // show location selection warning if no location was selected
        if (!selectedLocation) {
            return this.setState({ locationError: true });
        }
        const searchParameters = {
            encounterSearchAdvanced : [
              { name: 'locationList', value: [selectedLocation] },
              { name: 'timeQualifier', value: this.state.method },
            ]
        };
        this.props.search(searchParameters).then(results => {
            const allEncounterTypes = results.rows || [];
            this.props.addToHistory(this.getLocationSearchDescription(), allEncounterTypes, results.query);
            // reset fields to default
            this.setState({ location: '', method: 'ANY' });
        });
    }

    /**
     * Method to handle option selection in select fields. It sets the selected option
     * value to the property in state (referred to by the option id)
     * @param {Object} event - Object contatining data about the triggered event
     * @return {undefined}
     */
    handleSelectOption(event) {
        event.preventDefault();
        this.setState({ [event.target.id]: event.target.value });
        // Remove location selection warning
        if(event.target.id === 'location'){
            this.setState({ locationError: false });
        }
    }

    /**
     * Method to get an array of <option> element items from locations in the state
     * @return {Array} - An array containing option elements of availaible methods
     */
    getLocationOptions() {
        return this.state.locations.map((item) => {
            return <option value={item.id} key={shortId.generate()}>{item.value}</option>;
        });
    }

    /**
     * Method to get an array of <option> element items from methods in the state
     * @return {Array} - An array containing option elements of availaible methods
     */
    getMethodOptions() {
        return [
            <option key={shortId.generate()} value={'ANY'}>Any Encounter</option>,
            <option key={shortId.generate()} value={'LAST'}>Most Recent Encounter</option>,
            <option key={shortId.generate()} value={'FIRST'}>Earliest Encounter</option>
        ];
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
                <h3>Search By Location</h3>
                <form className="form-horizontal" onSubmit={this.searchByLocation}>
                    <div className={`form-group ${this.state.locationError ? "has-error": ""}`}>
                        <label htmlFor="gender" className="col-sm-2 control-label">Patients belonging to?:</label>
                        <div className="col-sm-6">
                            <select className="form-control" id="location" onChange={this.handleSelectOption} value={this.state.location}>
                                <option value="">--Select Location--</option>
                                {this.getLocationOptions()}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="gender" className="col-sm-2 control-label">According to Method:</label>
                        <div className="col-sm-6">
                            <select className="form-control" id="method" onChange={this.handleSelectOption} value={this.state.method}>
                                {this.getMethodOptions()}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-6">
                            <button type="submit" className="btn btn-success">Search</button>
                        </div>
                    </div>
                </form>
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
