import React, {Component} from 'react';
import shortId from 'shortid';

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
            description: ''
        };
        this.searchDemographics = this.searchDemographics.bind(this);
        this.navigatePage = this.navigatePage.bind(this);
        this.searchByAttributes = this.searchByAttributes.bind(this);
        this.toggleLivingStatus = this.toggleLivingStatus.bind(this);
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
            ],
            bornDuringPeriod: [
                {name: 'startDate', dataType: 'date'},
                {name: 'endDate', dataType: 'date'}
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
        const dayFormat = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        const livingStatus = this.state.livingStatus;
        if (livingStatus === 'alive' || livingStatus === 'dead') {
            searchParameters.diedDuringPeriod = [
                { name: 'endDate', dataType: 'date', value: dayFormat, livingStatus}
            ];
            // reset the living status in the state
            this.setState({ livingStatus: '' });
        }
        this.performSearch(searchParameters);
        document.querySelectorAll('form').forEach(form => form.reset());
    }

    getValuesFromFields(fields) {
        const searchParameters = {};
        // loops through the fields, the key of each value in the object fields is the definition library key
        // each value in the array is the parameter and the name represents the parameter name as well the field id in html
        for(const eachField in fields) {
            if(Array.isArray(fields[eachField])) {
                fields[eachField].forEach((fieldInput, index) => {
                    fields[eachField][index].value = document.getElementById(fieldInput.name).value
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
        this.props.search(searchParameters).then(results => {
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
        }
        const searchParameters = this.getValuesFromFields(fields);
        // the plus is used as a delimiter to allow users to be able to search using several values
        // for example, the value for the attribute citizenship can look like Nigeria+England.
        // this is still open to change, it was just implemented as a placeholder
        const values = searchParameters.personWithAttribute[1].value.split(',');
        searchParameters.personWithAttribute[1].value = values;
        this.performSearch(searchParameters);
        values.forEach((tag) => $('#values').removeTag(tag));

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

    render() {
        let attributes = this.state.patientAttributes.map((attribute) => {
            return (
                <option key={attribute.uuid} value={attribute.display}>
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
                        <input className="form-control" type="date" name="from-date" id="startDate" />
                    </div>
                    <span className="inline-label">And:</span>
                    <div className="col-sm-3">
                        <input className="form-control" name="to-date" type="date" id="endDate" />
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
