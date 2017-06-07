import React, {Component, PropTypes} from 'react';
import shortId from 'shortid';
import Select from 'react-select';
import DatePicker from "react-bootstrap-date-picker";
import { JSONHelper } from '../../../helpers/jsonHelper';

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
            method: 'ANY',
            onOrBefore: '',
            onOrAfter: '',
            selectedEncounterTypes: []
        };
        this.jsonHelper = new JSONHelper();
        this.searchByEncounter = this.searchByEncounter.bind(this);
        this.getFormValues = this.getFormValues.bind(this);
        this.handleSelectOption = this.handleSelectOption.bind(this);
        this.searchByLocation = this.searchByLocation.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.getDateString = this.getDateString.bind(this);
        this.resetEncounterFields = this.resetEncounterFields.bind(this);
        this.handleSelectEncounters = this.handleSelectEncounters.bind(this);
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
              { name: 'atMostCount' }
          ]
      };
      const searchParams = this.getFormValues(fields);
      if (this.state.onOrAfter) {
          searchParams.encounterSearchAdvanced.push({
              name: 'onOrAfter', type: 'date', value: this.state.onOrAfter
          });
      }
      if (this.state.onOrBefore) {
          searchParams.encounterSearchAdvanced.push({
              name: 'onOrBefore', type: 'date', value: this.state.onOrBefore
          });
      }
      const selectedEncounters = this.state.selectedEncounterTypes;
      if (selectedEncounters.length > 0) {
          searchParams.encounterSearchAdvanced.push({
              name: 'encounterTypeList',
              value: selectedEncounters.map(encounter => encounter.value)
          });
      }
      const label = this.composeLabel(searchParams.encounterSearchAdvanced);
      const queryDetails = this.jsonHelper.composeJson(searchParams);
      this.props.search(queryDetails, label).then(results => {
          const allEncounterTypes = results.rows || [];
          this.props.addToHistory(label, allEncounterTypes, results.query);
      });
    }

    /**
     * Method to handle selection changes from the custom encounter types Select
     * input
     * @param {Array} selectedEncounterTypes: Array containing Objects with data
     * about selected encounter types
     * @return {undefined}
     */
    handleSelectEncounters(selectedEncounterTypes) {
        this.setState({ selectedEncounterTypes });
    }

    /**
     * composeLabel will compose the right description for every search that is performed
     * @param {object} searchParameter 
     * @return {string} the label
     */
    composeLabel(searchParameters) {
        const parameters = [...searchParameters];
        let label = 'Patients with Encounter(s)';
        const selectedEncounters = this.state.selectedEncounterTypes
            .map(encounter => encounter.label )
            .join(', ')
            .replace(/,(?=[^,]*$)/, ' and ');
        label += selectedEncounters ? ` of Type(s) ${selectedEncounters}` : '';
        parameters.forEach(aParameter => {
            let theFieldValue = $('#encounter-search').find('#'+aParameter.name).val();
            if($('#encounter-search').find('#'+aParameter.name).prop("tagName") === 'SELECT') {
                aParameter.displayValue = $('#encounter-search').find('option[value='+theFieldValue+']').text();
            } else {
                aParameter.displayValue = theFieldValue;
            }
            if(aParameter.displayValue != '') {
                switch(aParameter.name) {
                case 'locationList':
                    label += ` at ${aParameter.displayValue}`; break;
                case 'formList':
                    label += ` from ${aParameter.displayValue}`; break;
                case 'atLeastCount':
                    label += ` at least ${aParameter.displayValue} ${aParameter.displayValue > 1 ? 'times' : 'time'}`; break;
                case 'atMostCount':
                    label += ` at most ${aParameter.displayValue} ${aParameter.displayValue > 1 ? 'times' : 'time'}`; break;
                case 'onOrAfter':
                    label += ` from ${this.state.onOrAfter}`; break;
                case 'onOrBefore':
                    label += ` to ${this.state.onOrBefore}`; break;
                }
            }
        });
        return label;
    }

    /**
     * Method to generate a location search description based on the search values
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
        const searchParameter = {
            encounterSearchAdvanced : [
              { name: 'locationList', value: [selectedLocation] },
              { name: 'timeQualifier', value: this.state.method },
            ]
        };
        const queryDetails = this.jsonHelper.composeJson(searchParameter);
        this.props.search(queryDetails, this.getLocationSearchDescription()).then(results => {
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

    /**
     * Method to update the date key for different date types in the state
     * @param {String} stateKey - The key in the component state that should be
     * updated
     * @return {Function} - Call back function to be executed by the date input
     * field
     */
    handleDateChange(stateKey) {
        return value => this.setState({
            [stateKey]: this.getDateString(value)
        });
    }

    /**
     * Method to get the date in the format MM-DD-YY from a date isoString
     * @param {String} isoString - Date in isoString format
     * @return {String} MM-DD-YY date formatted string
     */
    getDateString(isoString) {
        return isoString ? isoString.split('T')[0]: '';
    }

    /**
     * Metod to reset all fields in the encounter form of this component
     * @return {undefined}
     */
    resetEncounterFields() {
        this.setState({
            onOrBefore: '',
            onOrAfter: '',
            selectedEncounterTypes: []
        });
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
                        <Select
                            multi
                            joinValues
                            placeholder="Select Encounter Type"
                            value={this.state.selectedEncounterTypes} 
                            options={this.state.encouterTypes.map(d => {return {value: d.id, label: d.value};})}
                            onChange={this.handleSelectEncounters}
                        />
                    </div>
                    <span className="inline-label">(Leave blank for all encounter types)</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="locations" className="col-sm-2 control-label">At Location:</label>
                    <div className="col-sm-3">
                        <select className="form-control" id="locationList">
                            <option value="">--Select Location--</option>
                            {this.state.locations.map(location => this.displaySelectOption(location))}
                        </select>
                    </div>
                    <span className="inline-label">(Optional)</span>

                    <label htmlFor="formList" className="col-sm-2 control-label">From Form:</label>
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
                    <span className="inline-label">(Optional)</span>
                    <label htmlFor="atMost" className="col-sm-2 control-label">Upto this many: </label>
                    <div className="col-sm-3">
                        <input type="number" className="form-control" id="atMostCount"/>
                    </div>
                    <span className="inline-label">(Optional)</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="startDate" className="col-sm-2 control-label">From: </label>
                    <div className="col-sm-3">
                        <DatePicker
                            id="onOrAfter"
                            className="form-control"
                            dateFormat="DD-MM-YYYY"
                            value={this.state.onOrAfter}
                            onChange={this.handleDateChange('onOrAfter')}
                        />
                    </div>
                    <span className="inline-label">(Optional)</span>
                    <label htmlFor="endDate" className="col-sm-2 control-label">To: </label>
                    <div className="col-sm-3">
                        <DatePicker
                            id="onOrBefore"
                            className="form-control"
                            dateFormat="DD-MM-YYYY"
                            value={this.state.onOrBefore}
                            onChange={this.handleDateChange('onOrBefore')}
                        />
                    </div>
                    <span className="inline-label">(Optional)</span>
                  </div>

                  <div className="form-group submit-btn">
                    <div className="col-sm-offset-2 col-sm-6">
                      <button type="submit" className="btn btn-success" onClick={this.searchByEncounter}>Search</button>
                    <button type="reset" onClick={this.resetEncounterFields} className="btn btn-default cancelBtn">Reset</button>
                    </div>
                  </div>
                </form>
                <hr/>
                <h3>Search By Location</h3>
                <form className="form-horizontal" onSubmit={this.searchByLocation}>
                    <div className={`form-group ${this.state.locationError ? "has-error": ""}`}>
                        <label htmlFor="location" className="col-sm-2 control-label">Patients belonging to?:</label>
                        <div className="col-sm-6">
                            <select className="form-control" id="location" onChange={this.handleSelectOption} value={this.state.location}>
                                <option value="">--Select Location--</option>
                                {this.getLocationOptions()}
                            </select>
                        </div>
                        <span className="inline-label">(Required)</span>
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
                            <button type="reset" className="btn btn-default cancelBtn">Reset</button>
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
