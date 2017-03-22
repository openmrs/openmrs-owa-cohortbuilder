import React, {Component} from 'react';

class PatientComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientAttributes: [],
            searchResults: [],
            currentPage: 1,
            toDisplay: [],
            totalPage: 0,
            pagePatients: [],
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
        const fields = ['gender', 'minage', 'maxage'];
        const searchParameters = {};
        fields.forEach((fieldName) => {
            searchParameters[fieldName] = document.getElementById(fieldName).value;
        })
        this.props.search(searchParameters).then(results => {
            const allPatients = results.members;
            const pagePatientInfo = this.getPatientDetailsPromises(allPatients, this.state.currentPage);
            let pagePatientDetails = [];
            Promise.all(pagePatientInfo).then(patientDetails => {
                this.setState({toDisplay: patientDetails, searchResults: allPatients, totalPage: Math.ceil(allPatients.length/this.state.perPage)});
            });
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
        Promise.all(pagePatientInfo).then(patientDetails => {
            this.setState({ toDisplay: patientDetails, currentPage: pageToNavigate });
        });
    }

    getPatientDetailsPromises(allPatients, currentPage) {
        const pagePatientInfo = [];
        for(let index = (currentPage-1) * this.state.perPage; index < currentPage * this.state.perPage && index < allPatients.length; index++) {
            pagePatientInfo.push(
                new Promise((resolve, reject) => {
                this.props.fetchData(`patient/${allPatients[index].uuid}`)
                    .then(patientInfo => {
                        resolve(patientInfo);
                    });
                })
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
                        <input name="minage" id="minage" className="form-control" />
                    </div>
                    <span className="inline-label">And:</span>
                    <div className="col-sm-3">
                        <input name="maxage" id="maxage" className="form-control" />
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-2 control-label">Birthdate</label>
                   
                    <div className="col-sm-1">
                         <span className="inline-label">Between:</span>
                    </div>
                    <div className="col-sm-3">
                        <input className="form-control" type="date" name="from-date" id="from-date" />
                    </div>
                    <span className="inline-label">And:</span>
                    <div className="col-sm-3">
                        <input className="form-control" name="to-date" type="date" id="to-date" />
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
                                    <tr key={patient.uuid}>
                                        <td>{patient.person.display}</td>
                                        <td>{patient.person.age}</td>
                                        <td>{patient.person.gender}</td>
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