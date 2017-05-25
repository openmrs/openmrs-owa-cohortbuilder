import React, {Component} from 'react';
import shortId from 'shortid';
import DatePicker from "react-bootstrap-date-picker";
import { JSONHelper } from '../../../helpers/jsonHelper';

class PatientComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientAttributes: [],
            searchResults: [],
            currentPage: 1,
            toDisplay: [],
            totalPage: 0,
            perPage: 10,
            livingStatus: '',
            description: '',
            startDate: '',
            endDate: ''
        };
        this.jsonHelper = new JSONHelper();
        this.searchDemographics = this.searchDemographics.bind(this);
        this.navigatePage = this.navigatePage.bind(this);
        this.searchByAttributes = this.searchByAttributes.bind(this);
        this.toggleLivingStatus = this.toggleLivingStatus.bind(this);
        this.getDateString = this.getDateString.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.resetSearchByDemographic = this.resetSearchByDemographic.bind(this);
    }

    componentDidMount(props) {
        this.props.fetchData('/personattributetype').then(data => {
            this.setState({
                patientAttributes: data.results
            });
        });
    }

    searchDemographics(event) {
        event.preventDefault();
        const fields = {
            gender: '',
            atLeastAgeOnDate: [
                {name: 'minAge', dataType: 'int'}
            ],
            upToAgeOnDate: [
                {name: 'maxAge', dataType: 'int'}
            ],
            ageRangeOnDate: [
                {name: 'minAge', dataType: 'int'},
                {name: 'maxAge', dataType: 'int'}
            ]
        };
        const searchParameters = this.getValuesFromFields(fields);

        // remove upToAgeOnDate & atLeastAgeOnDate if both minAge & maxAge was filled
        if(searchParameters.ageRangeOnDate[0].value && searchParameters.ageRangeOnDate[1].value) {
            delete searchParameters.atLeastAgeOnDate;
            delete searchParameters.upToAgeOnDate;
        } else {
            // then the ageRangeOnDate should be deleted
            delete searchParameters.ageRangeOnDate;
        }
        // for dead people, diedDuring period -> endDate === now
        // for living people, diedDuring period -> endDate !== now
        const today = new Date();
        const dayFormat = this.getDateString(today.toISOString());
        const livingStatus = this.state.livingStatus;
        if (livingStatus === 'alive' || livingStatus === 'dead') {
            searchParameters.diedDuringPeriod = [
                { name: 'endDate', dataType: 'date', value: dayFormat, livingStatus}
            ];
            // reset the living status in the state
            this.setState({ livingStatus: '' });
        }

        if (this.state.endDate && this.state.startDate) {
            searchParameters.bornDuringPeriod = [
                {name: 'startDate', dataType: 'date', value: this.state.startDate},
                {name: 'endDate', dataType: 'date', value: this.state.endDate}
            ];
        }

        this.performSearch(searchParameters);
    }

    getValuesFromFields(fields) {
        const searchParameters = {};
        // loops through the fields, the key of each value in the object fields is the definition library key
        // each value in the array is the parameter and the name represents the parameter name as well the field id in html
        for(const eachField in fields) {
            if(Array.isArray(fields[eachField])) {
                fields[eachField].forEach((fieldInput, index) => {
                    fields[eachField][index].value = document.getElementById(fieldInput.name).value;
                });
                searchParameters[eachField] = fields[eachField];
                continue;
            }
            searchParameters[eachField] = document.getElementById(eachField).value;
        }
        return searchParameters;
    }

    performSearch(searchParameters) {
        const theParameter = Object.assign({}, searchParameters);
        const queryDetails = this.jsonHelper.composeJson(theParameter);
        // we want to append necessary rowFilters here if user selected all patients
        if (searchParameters.gender === 'all') {
            const tempRowFilter = ['males', 'females', 'unknownGender'].map(item => {
               return  {
                    type: "org.openmrs.module.reporting.dataset.definition.PatientDataSetDefinition",
                    key: `reporting.library.cohortDefinition.builtIn.${item}`
                };
            });
            queryDetails.query.rowFilters = queryDetails.query.rowFilters.length > 0 ?
                [ ...queryDetails.query.rowFilters, ...tempRowFilter ] : tempRowFilter;
            const filters = queryDetails.query.rowFilters;
            const filterCombination = queryDetails.query.customRowFilterCombination;
            queryDetails.query.customRowFilterCombination = filterCombination ? 
                `(${filters.length - 2} OR ${filters.length - 1} OR ${filters.length}) AND ${filterCombination}`
                : '(1 OR 2 OR 3)';
        }
        this.props.search(queryDetails).then(results => {
            const allPatients = results.rows || [];
            // adds the current search to search history
            let searchHistory = results.searchDescription;
            if(results.query.rowFilters[0].key === "reporting.library.cohortDefinition.builtIn.personWithAttribute"){
                searchHistory =  searchHistory.replace(/([^\W])\,([^\W])/gi,'$1, $2');
                let lastItem = searchHistory.match(/\,\s(\w*)$/gi);
                let newItem = (lastItem) ? lastItem[0].replace(/,/, ' or') : null;
                searchHistory = searchHistory.replace(lastItem, newItem);
            }
            this.props.addToHistory(searchHistory, allPatients, results.query);
        });
    }
    
    searchByAttributes(event) {
        event.preventDefault();
        const fields = {
            personWithAttribute: [
                {name: "attributeType"},
                {name: "values"}
            ]
        };
        const searchParameters = this.getValuesFromFields(fields);
        // the plus is used as a delimiter to allow users to be able to search using several values
        // for example, the value for the attribute citizenship can look like Nigeria+England.
        // this is still open to change, it was just implemented as a placeholder
        const values = searchParameters.personWithAttribute[1].value.split(',');
        searchParameters.personWithAttribute[1].value = values;
        this.performSearch(searchParameters);
    }

    navigatePage(event) {
        event.preventDefault();
        let pageToNavigate = 0;
        switch(event.target.value) {
            case 'first': pageToNavigate = 1; break;
            case 'last': pageToNavigate = this.state.totalPage; break;
            default: pageToNavigate = (event.target.value === 'next') ? this.state.currentPage+1 : this.state.currentPage-1;
        }
        const pagePatientInfo = this.getPatientDetailsPromises(this.state.searchResults, pageToNavigate);
        this.setState({ toDisplay: pagePatientInfo, currentPage: pageToNavigate });
    }

    getPatientDetailsPromises(allPatients, currentPage) {
        const pagePatientInfo = [];
        for(let index = (currentPage-1) * this.state.perPage; index < currentPage * this.state.perPage && index < allPatients.length; index++) {
            pagePatientInfo.push(
                allPatients[index]
            );
        }
        return pagePatientInfo;
    }

    toggleLivingStatus(event) {
        this.setState({ livingStatus: event.target.value });
    }

    reset() {
        $('#values').importTags('');
    }

    /**
     * Method to reset all state related to search by demographic in this
     * component
     * @return {undefined}
     */
    resetSearchByDemographic() {
        this.setState({ startDate: '', endDate: '' });
    }

    /**
     * Method to set the end date String in state
     * @param {String} value - isoString formatted date value
     * @return {undefined}
     */
    setEndDate(value) {
        this.setState({ endDate: this.getDateString(value) });
    }

    /**
     * Method to update the date key for different date types in the state
     * @param {String} stateKey - The key in the component state that should be
     * updated
     * @return {Function} - Call back function to be executed by the date input
     * field
     */
    handleDateChange(dateType) {
        return value => this.setState({
            [dateType]: this.getDateString(value)
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

    render() {
        let attributes = this.state.patientAttributes.map((attribute) => {
            return (
                <option key={attribute.uuid} value={attribute.uuid}>
                    {attribute.display}
                </option>
            );
        });
    return (
        <div>
            <h3>Search By Demographic</h3>
            <form className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="gender" className="col-sm-2 control-label">Gender</label>
                    <div className="col-sm-6">
                        <select className="form-control" id="gender" name="gender">
                            <option value="all">All</option>
                            <option value="males">Male</option>
                            <option value="females">Female</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-2 control-label">Age</label>
                   
                    <div className="col-sm-1">
                         <span className="inline-label">Between:</span>
                    </div>
                    <div className="col-sm-3">
                        <input name="minage" id="minAge" className="form-control" />
                    </div>
                    <span className="inline-label">And:</span>
                    <div className="col-sm-3">
                        <input name="maxage" id="maxAge" className="form-control" />
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-2 control-label">Birthdate</label>
                   
                    <div className="col-sm-1">
                         <span className="inline-label">Between:</span>
                    </div>
                    <div className="col-sm-3">
                        <DatePicker
                            className="form-control"
                            id="startDate"
                            dateFormat="DD-MM-YYYY"
                            value={this.state.startDate}
                            onChange={this.handleDateChange('startDate')}
                        />
                    </div>
                    <span className="inline-label">And:</span>
                    <div className="col-sm-3">
                        <DatePicker
                            className="form-control"
                            id="endDate"
                            dateFormat="DD-MM-YYYY"
                            value={this.state.endDate}
                            onChange={this.handleDateChange('endDate')}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-6">
                        <div className="checkbox patient-status">
                            <label>
                                <input type="radio" value="alive" name="livingStatus" onChange={this.toggleLivingStatus}/> Alive Only
                            </label>
                            <label>
                                <input type="radio" value="dead" name="livingStatus" onChange={this.toggleLivingStatus}/> Dead Only
                            </label>
                        </div>
                    </div>
                </div>
                
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-6">
                        <button type="submit" onClick={this.searchDemographics} className="btn btn-success">Search</button>
                        <button type="reset" onClick={this.resetSearchByDemographic} className="btn btn-default cancelBtn">Reset</button>
                    </div>
                </div>
            </form>
            
            <h3>Search By Person Attributes</h3>
            <form className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="gender" className="col-sm-2 control-label">Which Attribute</label>
                    <div className="col-sm-3">
                        <select className="form-control" id="attributeType">
                            <option value="">Any</option>
                            {attributes}
                        </select>
                    </div>
                    <label className="col-sm-1 control-label">Value</label>
                    <div className="col-sm-3">
                         <input className="form-control" type="text" name="values" id="values" />
                    </div>
                </div>

                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-6">
                        <button type="submit" onClick={this.searchByAttributes} className="btn btn-success">Search</button>
                        <button onClick={this.reset} type="reset" className="btn btn-default cancelBtn">Reset</button>
                    </div>
                </div>
            </form>
            <hr/>
        </div>
    );
    }
}

PatientComponent.propTypes = {
    addToHistory: React.PropTypes.func.isRequired,
    search: React.PropTypes.func.isRequired,
    fetchData: React.PropTypes.func.isRequired
};

export default PatientComponent;
