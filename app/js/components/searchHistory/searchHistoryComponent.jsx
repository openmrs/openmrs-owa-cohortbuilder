import React, {Component, PropTypes} from 'react';
import shortId from 'shortid';
import { ApiHelper } from '../../helpers/apiHelper';
import DownloadHelper from '../../helpers/downloadHelper';
import { JSONHelper } from '../../helpers/jsonHelper';
import CohortModal from '../cohorts/cohortModal';

import Modal from './saveModal.jsx';
import './searchHistory.css';

class SearchHistoryComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchHistory : [],
            searchResults: [],
            currentPage: 1,
            toDisplay: [],
            totalPage: 0,
            perPage: 10,
            description: '',
            index: 0,
            queryId: 0
        };
        this.navigatePage = this.navigatePage.bind(this);
        this.historyItemData = this.historyItemData.bind(this);
        this.downloadCSV = this.downloadCSV.bind(this);
    }

    navigatePage(event) {
        event.preventDefault();
        let pageToNavigate = 0;
        switch(event.target.value) {
            case 'first': pageToNavigate = 1; break;
            case 'last': pageToNavigate = this.state.totalPage; break;
            default: pageToNavigate = (event.target.value === 'next') ? this.state.currentPage+1 : this.state.currentPage-1;
        }
        const pagePatientInfo = this.getPagePatient(this.state.searchResults, pageToNavigate);
        this.setState({ toDisplay: pagePatientInfo, currentPage: pageToNavigate });
    }

    viewResult(index) {
        return (event) => {
            event.preventDefault();
            const allPatients = this.props.history[index].patients;
            const pagePatientInfo = this.getPagePatient(allPatients, 1);
            const description = this.props.history[index].description;
            this.setState({
                toDisplay: pagePatientInfo,
                searchResults: allPatients,
                description,
                totalPage: Math.ceil(allPatients.length/this.state.perPage),
                currentPage: 1,
            });
        };
    }

    getPagePatient(allPatients, currentPage) {
        const pagePatientInfo = [];
        for(let index = (currentPage-1) * this.state.perPage; index < currentPage * this.state.perPage && index < allPatients.length; index++) {
            pagePatientInfo.push(
                allPatients[index]
            );
        }
        return pagePatientInfo;
    }

    delete(index) {
        return (event) => {
            event.preventDefault();
            this.props.deleteHistory(index);
        };
    }
    
    setSaveSearch(index) {
        const searchResult =  this.props.history[index];
        return () => {
            this.setState({index, description: searchResult.description});
        };
    }

    /**
     * Method to help filter and return only required patient attributes from a
     * search history item
     * @param { Number } index - Index of the history array to pick patients
     * @return { Array } - Array containing all patients in a search history
     * item of the specified index
     */
    historyItemData(index) {
        return this.props.history[index].patients.map(patient => {
            return {
                Name: `${patient.firstname} ${patient.lastname}`,
                Age: patient.age,
                Gender: patient.gender
            };
        });
    }

    /**
    * Method to download list of patients in CSV format
    * @param { Number } index - Index of the history array to pick patients
    * @param { String} description - Description of the search (to be used as
    * the csv file name)
    * @return { function } - Method to be triggered when a click event is fired
    */
    downloadCSV(index, description) {
        return (event) => {
            event.preventDefault();
            const patientsData = this.historyItemData(index);
            DownloadHelper.downloadCSV(patientsData, description);
        };
    }

    setSaveCohort(description, index) {
        return () => {
            this.setState({queryId : index, description});
        };
    }

    render(){
        const { history } = this.props;
        return (
          <div>
            <Modal
                index={this.state.index}
                description={this.state.description}
                saveSearch={this.props.saveSearch}
                history={this.props.history}
                error={this.props.error}
                loading={this.props.loading}
             />
             <CohortModal 
               query={this.state.description}
               queryId={this.state.queryId}
               history={this.props.history}
             />
            <div className="col-sm-12 section">
                <h3>Search History</h3>
                <div className="result-window">
                   
                    {
                        (history.length > 0) ?
                         <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Query</th>
                                    <th>Results</th>
                                </tr>
                            </thead>
                            <tbody>
                               {
                                   history.map((eachResult, index) => 
                                    <tr key={shortId.generate()}>
                                        <td scope="row">{this.props.history.length - index}</td>
                                        <td>
                                            {eachResult.description} 
                                            <a className="link" title="Save Query Definition" aria-hidden="true"  data-toggle="modal" data-target="#myModal" onClick={this.setSaveSearch(index)}>Save</a>
                                            <a className="link" title={`Delete ${eachResult.description}`} onClick={this.delete(index)} aria-hidden="true">Delete</a>
                                        </td>
                                        <td>
                                            <a className="link" onClick={this.viewResult(index)} title={`View ${eachResult.description}`} aria-hidden="true">{`${eachResult.patients.length} result(s)`}</a>
                                            <a className="link" onClick={this.downloadCSV(index, eachResult.description)} title={`Dowload ${eachResult.description}`} aria-hidden="true">Download</a>
                                            <a className="link" title="Save Cohorts" aria-hidden="true"  data-toggle="modal" data-target="#myCohort" onClick={this.setSaveCohort(eachResult.description, index)}>Save</a>
                                        </td>
                                    </tr>
                                   )
                               }
                            </tbody>
                        </table>
                            : ""
                    }
                     
                </div>

                {(this.state.searchResults.length) ? 
                <div className="result row col-sm-8 col-sm-offset-2">
                    <h2 className="center-align">{this.state.description}</h2>
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
          </div>
        );
    }
}

SearchHistoryComponent.propTypes = {
    history: React.PropTypes.array.isRequired,
    deleteHistory: React.PropTypes.func.isRequired,
    saveSearch: PropTypes.func,
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired
};

export default SearchHistoryComponent;
