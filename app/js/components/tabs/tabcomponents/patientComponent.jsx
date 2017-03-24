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
            perPage: 10
        };
        this.searchDemographics = this.searchDemographics.bind(this);
        this.navigatePage = this.navigatePage.bind(this);
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
        const searchParameters = {};
        for(const eachField in fields) {
            if(Array.isArray(fields[eachField])) {
                fields[eachField].forEach((fieldInput, index) => {
                    fields[eachField][index].value = document.getElementById(fieldInput.name).value
                    if(fields[eachField][index].value) {
                        fields[eachField][index].value += (fieldInput.name === 'startDate' || fieldInput.name === 'endDate') ? ' 00:00:00 UTC' : '';
                    }
                });
                searchParameters[eachField] = fields[eachField];
                continue;
            }
            searchParameters[eachField] = document.getElementById(eachField).value;
        }

        // remove upToAgeOnDate & atLeastAgeOnDate if both minAge & maxAge was filled
        if(searchParameters.ageRangeOnDate[0].value && searchParameters.ageRangeOnDate[1].value) {
            delete searchParameters.atLeastAgeOnDate;
            delete searchParameters.upToAgeOnDate;
        } else {
            // then the ageRangeOnDate should be deleted
            delete searchParameters.ageRangeOnDate;
        }

        this.props.search(searchParameters).then(results => {
            const allPatients = results.rows;
            const pagePatientInfo = this.getPatientDetailsPromises(allPatients, this.state.currentPage);
            this.setState({toDisplay: pagePatientInfo, searchResults: allPatients, totalPage: Math.ceil(allPatients.length/this.state.perPage)});
        });
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
                                <input type="checkbox" value="alive"/> Alive
                            </label>
                            <label>
                                <input type="checkbox" value="dead"/> Dead
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
                        <select className="form-control" id="gender">
                            <option value="">Any</option>
                            {attributes}
                        </select>
                    </div>
                    <label className="col-sm-1 control-label">Value</label>
                    <div className="col-sm-3">
                         <input className="form-control" type="text" name="value" />
                    </div>
                </div>

                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-6">
                        <button type="submit" className="btn btn-success">Search</button>
                    </div>
                </div>
            </form>
            <hr/>
            {(this.state.searchResults.length) ? 
                <div className="result row col-sm-8 col-sm-offset-2">
                    <table className="table table-striped" >
                        <thead>
                            <tr>
                                <td>NAME</td>
                                <td>AGE</td>
                                <td>GENDER</td>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.toDisplay.map(patient => {
                                return (
                                    <tr key={shortId.generate()}>
                                        <td>{`${patient.firstname} ${patient.lastname}`}</td>
                                        <td>{patient.age}</td>
                                        <td>{patient.gender}</td>
                                    </tr>);
                            })
                        }
                        </tbody>
                    </table>
                    
                    <div className="tableNavigation">
                        <button className="btn btn-primary" onClick={this.navigatePage} value="first">FIRST</button>
                        {
                            (this.state.currentPage > 1) ?
                                <button className="btn btn-primary" onClick={this.navigatePage} value="previous">PREVIOUS</button> :
                                null
                        }

                        {
                            (this.state.currentPage < this.state.totalPage) ?
                                <span>
                                    <button className="btn btn-primary" onClick={this.navigatePage} value="next">NEXT</button>
                                    <button className="btn btn-primary" onClick={this.navigatePage} value="last">LAST</button>
                                </span> :
                                null
                        }
                        <span className="page-display-counter">{this.state.currentPage + " of " + this.state.totalPage}</span>
                    </div>
                </div> :
                null
            }
        </div>
    );
    }
}

export default PatientComponent;
