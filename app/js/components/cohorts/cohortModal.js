import React, {Component, PropTypes} from 'react';
import shortId from 'shortid';

import { ApiHelper } from '../../helpers/apiHelper';
import DownloadHelper from '../../helpers/downloadHelper';
import './cohorts.css';

class ActionsComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      allCohort: [],
      cohortResult: [],
      toDisplay: [],
      perPage: 10,
      downloadJobIds: []
    };

    this.apiHelper = new ApiHelper();
    this.navigatePage = this.navigatePage.bind(this);
    this.getPatientsData = this.getPatientsData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteCohort = this.deleteCohort.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);
    this.resetError = this.resetError.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentWillMount() {
    this.getAllCohorts();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      query: nextProps.query,
      queryId: nextProps.queryId,
      description: nextProps.query,
    });
  }

  /**
   * This method fetches all the cohorts from the database
   * and adds the result to the state
   * 
   * @memberof ActionsComponent
   */
  getAllCohorts() {
    const apiHelper = new ApiHelper();
    apiHelper.get('/cohort?v=full')
            .then(res => {
              this.setState(Object.assign({}, this.state, {
                allCohort: res.results
              }));
            });
  }

  /**
   * This method maps the content of the values of the form
   * input fields to the state
   * 
   * @param {Object} e the form event  
   * @memberof ActionsComponent
   */
  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  /**
   * This methods handles the submit form event, it ensures that 
   * all form fields are populated with valid contents before the form 
   * can be submitted
   * 
   * @param {Object} event The event  
   * @memberof ActionsComponent
   */
  handleSubmit(e) {
    e.preventDefault();
    const query = this.state.query;
    if (query && !isNaN(this.state.queryId) && e.target.name.value.length > 0 &&
            e.target.description.value.length > 0 && e.target.name.value.trim() && e.target.description.value.trim()) {
      const apiHelper = new ApiHelper();
      apiHelper.post('/cohort', this.getQueryData())
                .then((res) => {
                  this.setState(Object.assign({}, this.state, {
                    allCohort: [res, ...this.state.allCohort],
                    error: null,
                    name :'', 
                    description: ''
                  }));
                    
                  $('#myCohort').modal('hide');          
                });
    } else {
      this.setState({ error: "all fields are required" });
    }
  }

  onSave(event) {
    event.preventDefault();
    const {name, description} = this.state;
    if(name && description && name.trim() && description.trim()) {
      event.target.name.value= "";
      event.target.description.value="";
    }
  }

  /**
   * This method resets all the fields on the form to thier default
   * values
   * 
   * @memberof ActionsComponent
   */
  resetError(){
    this.setState({
      error: '',
      name :'', 
      description: ''
    });
  }

  displayHistory(history, index) {
    return (
			<option value={index} key={shortId.generate()}>{history.description}</option>
    );
  }

  /**
   * This method is used to organize all the data that are needed when a 
   * cohort needs to be created
   * 
   * @returns {Object} display, name, description, memberIds
   * @memberof ActionsComponent
   */
  getQueryData() {
    return {
      display: this.state.query,
      name: this.state.name,
      description: this.state.description,
      memberIds: this.getPatientId(this.state.queryId)
    };
  }

  getPatientId(cohortId) {
    return this.props.history[cohortId].patients.map((patient) => patient.patientId);
  }

  /**
   * This method fetches all the patients on 
   * a page
   * 
   * @param {Array} allPatients 
   * @param {Integer} currentPage 
   * @returns {Object} pagePatientInfo
   * @memberof ActionsComponent
   */
  getPagePatient(allPatients, currentPage) {
    const pagePatientInfo = [];
    for (let index = (currentPage - 1) * this.state.perPage; index < currentPage * this.state.perPage && index < allPatients.length; index++) {
      pagePatientInfo.push(
				allPatients[index]
			);
    }
    return pagePatientInfo;
  }

  /**
   * This method handles the page navigation feature
   * 
   * @param {Object} event The navigation event
   * @memberof ActionsComponent
   */
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
      this.apiHelper.get(`/cohort/${cohortId}/member?v=full`)
        .then(res => 
        {
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

  /**
   * Method to fetch data using the cohort uuid, format the data and download
   * it on the browser
   * 
   * @param {Number} cohortId - unique cohort id
   * @param {String} description - Description of the cohort (to be used as
   * the saved csv file name)
   * @return {undefined}
   */
  downloadCSV(cohortId, description) {
    return event => {
      event.preventDefault();
      if (this.state.downloadJobIds.includes(cohortId)) {
        return;
      }
      const downloadJobIds = [...this.state.downloadJobIds, cohortId];
      this.setState({ downloadJobIds });
      this.apiHelper.get(`/cohort/${cohortId}/member?v=full`)
				.then(response => {
  const toSplice = this.state.downloadJobIds;
  const spliceIndex = toSplice.indexOf(cohortId);
  toSplice.splice(spliceIndex, 1);
  const formattedData = this.preFromatForCSV(response.results);
  DownloadHelper.downloadCSV(formattedData, description);
  this.setState({ downloadJobIds: toSplice });
}); 
    };
  }

  /**
   * This method deletes a cohort from the database by the cohort ID
   * 
   * @param {Integer} cohortId 
   * @returns 
   * @memberof ActionsComponent
   */
  deleteCohort(cohortId) {
    return (e) => {
      const apiHelper = new ApiHelper();
      apiHelper.delete(`/cohort/${cohortId}`)
                .then(() => {
                  this.getAllCohorts();
                });
    };
  }

    /**
     * Method to help filter and return only required patient attributes from a
     * cohort item
     * @return { Array } - Array containing all patients in a cohort
     * item of the specified index
     */
  preFromatForCSV(results) {
    const data = [...results];
    return data.map(item => {
      const person = item.patient.person;
      return { name: person.display, age: person.age, gender: person.gender };
    });
  }

  render() {
    return(
             <div className="modal fade" id="myCohort" tabIndex="-1" role="dialog" aria-labelledby="myCohortLabel">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.resetError}><span aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title" id="myCohortLabel">Save Cohorts</h4>
                    </div>
                    <div className="modal-body" onSubmit={this.onSave}>  
                        <form className="form-horizontal" id="cohort" onSubmit={this.handleSubmit}>
                            { this.state.error ?
                            <div className="alert alert-danger text-center">{this.state.error}</div> : ""}
                            <div className="form-group">
                                <label className="control-label col-sm-2">Query:</label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" name="query" 
                                        value={this.state.query}
                                    placeholder="Enter name" onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label col-sm-2">Name:</label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" name="name" placeholder="Enter name" onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label col-sm-2">Description:</label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" name="description" placeholder="Enter description" onChange={this.handleChange}
                                        value={this.state.description} />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-sm-offset-2 col-sm-10">
                                    <button type="submit" className="btn btn-success">Save</button>
                                    <button type="reset" className="btn btn-default cancelBtn" onClick={this.resetError}>Reset</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.resetError}>Close</button>
                    </div>
                    </div>
                </div>
            </div>
            
    );
  }
}

ActionsComponent.propTypes ={
  history: PropTypes.array.isRequired,
  query: PropTypes.string.isRequired,
  queryId: PropTypes.number.isRequired
};

export default ActionsComponent;
