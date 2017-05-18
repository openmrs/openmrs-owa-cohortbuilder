import React,{ Component, PropTypes } from 'react';
import shortId from 'shortid';

import SearchHistory from './searchHistoryComponent.jsx';
import SavedHistoryTable from './savedHistoryTable.jsx';
import { Navigate } from '../cohorts/navigate.jsx';
import { ApiHelper }  from '../../helpers/apiHelper';


class  SavedHistory extends Component {
    constructor(props) {
        super(props);
        this.state =  {
            history: [],
            allHistory: [],
            toDisplay: [],
            perPage: 10,
            description: "",
            currentPage: 2,
            totalPage: 0
            
        };
        this.delete = this.delete.bind(this);
        this.getPagePatient = this.getPagePatient.bind(this);
        this.navigatePage = this.navigatePage.bind(this);
        this.getPagePatient = this.getPagePatient.bind(this);
    }

    removeCharacters(value) {
        return value.substr(value.lastIndexOf(']') +1).trim();
    }

    delete(uuid) {
       return () => {
            const apiHelper = new ApiHelper();
            apiHelper.delete(`reportingrest/adhocdataset/${uuid}?purge=true`)
            .then(() => {
                this.props.updateHistory(uuid);
            });
       };
    }
    viewResult(uuid) {
        return () => {
            const apiHelper = new ApiHelper();
            apiHelper.get(`reportingrest/dataSet/${uuid}`)
                .then((res) => {
                    const toDisplay = this.getPagePatient(res.rows, 1);
					this.setState(Object.assign({}, this.state, {
						allHistory: res.rows,
						currentPage: 1,
						toDisplay,
						totalPage:  Math.ceil(res.rows.length/this.state.perPage),
						description: res.definition.description
					}));
                });
        };
    }

    getPagePatient(allHistory, currentPage) {
		const pagePatientInfo = [];
		for (let index = (currentPage - 1) * this.state.perPage; index < currentPage * this.state.perPage && index < allHistory.length; index++) {
			pagePatientInfo.push(
				allHistory[index]
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
		const pagePatientInfo = this.getPagePatient(this.state.allHistory, pageToNavigate);
		this.setState(Object.assign({}, this.state, {
			toDisplay: pagePatientInfo,
			currentPage: pageToNavigate
		}));
	}
    render() {
        return (
            <div className="section">
                <div className="result-window">
                    {
                        (this.props.history.length > 0) ?
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>S/N</th>
                                        <th>Display</th>
                                        <th>Description</th>
                                        <th>Delete</th>
                                        <th>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.history.map((eachResult, index) =>
                                            <tr key={shortId.generate()}>
                                                <td>{index}</td>
                                                <td>{this.removeCharacters(eachResult.name)}</td>
                                                <td>{eachResult.description +' result(s)'}</td>
                                                <td><span className="glyphicon glyphicon glyphicon-remove remove" title="Remove" onClick={this.delete(eachResult.uuid)} aria-hidden="true"/></td>
                                                <td><span className="glyphicon glyphicon-eye-open view" onClick={this.viewResult(eachResult.uuid)} title="View" aria-hidden="true"/></td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                            : <p className="text-center">No search History</p>
                    }
                </div>
                 <div className="row cohort-table">
                    <div className="col-sm-8 col-sm-offset-2">
                        { (this.state.toDisplay.length > 0) ?
                        <div>
                            <SavedHistoryTable toDisplay={this.state.toDisplay} description={this.state.description} />
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

SavedHistory.propTypes = {
    history: PropTypes.array.isRequired,
    updateHistory: PropTypes.func.isRequired
};

export default SavedHistory;