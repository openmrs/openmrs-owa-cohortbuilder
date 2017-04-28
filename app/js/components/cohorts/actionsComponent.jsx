import React, {Component, PropTypes} from 'react';
import shortId from 'shortid';

import { ApiHelper } from '../../helpers/apiHelper';
import { Navigate } from './navigate';
import CohortTable from './cohortTable';
import './cohorts.css';

class ActionsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allCohort: [],
            cohortResult: [],
            toDisplay: [],
            perPage: 10,
        };

        this.navigatePage = this.navigatePage.bind(this);
        this.getPatientsData = this.getPatientsData.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChnage = this.handleChnage.bind(this);
    }

    componentWillMount() {
        const apiHelper = new ApiHelper();
        apiHelper.get('/cohort?v=full')
            .then(res => {
                this.setState(Object.assign({}, this.state, {
                    allCohort: res.results.reverse()
                }));
            });
    }

    handleChnage(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const cohort = this.state.cohort;
        if (cohort && !isNaN(cohort) && this.state.hasOwnProperty('name') &&
            this.state.hasOwnProperty('description')) {
            const apiHelper = new ApiHelper();
            apiHelper.post('/cohort', this.getQueryData())
                .then((res) => {
                    this.setState(Object.assign({}, this.state, {
                            allCohort: [res, ...this.state.allCohort]
                    }));
                    document.getElementById('cohort').reset();
                    
                });
        } else {
            this.setState({ error: "all fields are required" });
        }
    }

	displayHistory(history, index) {
		return (
			<option value={index} key={shortId.generate()}>{history.description}</option>
		);
	}

	getQueryData() {
		return {
            display: this.state.name,
            name: this.state.name,
            description: this.state.description,
            memberIds: this.getPatientId(this.state.cohort)
		};
	}


	getPatientId(cohortId) {
		return this.props.history[cohortId].patients.map((patient) => patient.patientId);
	}

	getPagePatient(allPatients, currentPage) {
		const pagePatientInfo = [];
		for (let index = (currentPage - 1) * this.state.perPage; index < currentPage * this.state.perPage && index < allPatients.length; index++) {
			pagePatientInfo.push(
				allPatients[index]
			);
		}
		return pagePatientInfo;
	}

	navigatePage(event) {
		event.preventDefault();
		let pageToNavigate = 0;
		switch (event.target.value) {
			case 'first':
				pageToNavigate = 1;
				break;
			case 'last':
				pageToNavigate = this.state.totalPage;
				break;
			default:
				pageToNavigate = (event.target.value === 'next') ? this.state.currentPage + 1 : this.state.currentPage - 1;
		}
		const pagePatientInfo = this.getPagePatient(this.state.cohortResult, pageToNavigate);
		this.setState(Object.assign({}, this.state, {
			toDisplay: pagePatientInfo,
			currentPage: pageToNavigate
		}));
	}

	getPatientsData(cohortId, description) {
		return (e) => {
			const apiHelper = new ApiHelper();
			apiHelper.get(`/cohort/${cohortId}/member?v=full`)
				.then(res => {
					const toDisplay = this.getPagePatient(res.results, 1);
					this.setState(Object.assign({}, this.state, {
						cohortResult: res.results,
						currentPage: 1,
						toDisplay,
						totalPage:  Math.ceil(res.results.length/this.state.perPage),
						cohortDescription: description
					}));
				}); 
		};
	}

    render() {
        return(
            <div className="section">
                <div className="col-md-7">
                    <h3>Save Cohort</h3>
                    <form className="form-horizontal" id="cohort" onSubmit={this.handleSubmit}>
                        { this.state.error ?
                        <div className="alert alert-danger text-center">{this.state.error}</div> : ""}
                        <div className="form-group">
                            <label className="control-label col-sm-2">Select Cohort to save</label>
                            <div className="col-sm-8">
                                <select className="form-control" name="cohort" onChange={this.handleChnage}>
                                    <option>select a cohort search</option>
                                    {this.props.history.map(this.displayHistory)}
                                </select>

                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-sm-2">Name:</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" name="name" placeholder="Enter name" onChange={this.handleChnage} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-sm-2">Description:</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" name="description" placeholder="Enter description" onChange={this.handleChnage} />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <button type="submit" className="btn btn-success">Save</button>
                                <button className="btn btn-default cancelBtn">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="col-md-5 ">
                    <h3>All Saved Cohort</h3>
                    <div className="cohort-view">
                        { (this.state.allCohort.length > 0) ?
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <td>S/N</td>
                                    <td>Display</td>
                                    <td>Description</td>
                                    <td>View</td>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.allCohort.map((cohort, index) =>
                                <tr key={shortId.generate()}>
                                    <td>{index + 1}</td>
                                    <td>{ cohort.display }</td>
                                    <td>{cohort.description}</td>
                                    <td><span className="glyphicon glyphicon-eye-open view" onClick={this.getPatientsData(cohort.uuid, cohort.description)} title="View" aria-hidden="true" />
                                    </td>
                                </tr>
                                ) }
                            </tbody>
                        </table> :
                        <p className="text-center">No saved cohort</p>
                        }
                    </div>
                </div>
                <div className="row cohort-table">
                    <div className="col-sm-8 col-sm-offset-2">
                        { (this.state.toDisplay.length > 0) ?
                        <div>
                            <CohortTable toDisplay={this.state.toDisplay} description={this.state.cohortDescription} />
                            <Navigate totalPage={this.state.totalPage} currentPage={this.state.currentPage} navigatePage={this.navigatePage} />
                        </div>
                        :
                        <div className="text-center">No data to display</div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

ActionsComponent.propTypes ={
	history: PropTypes.array.isRequired
};

export default ActionsComponent;
