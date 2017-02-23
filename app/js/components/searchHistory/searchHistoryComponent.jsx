import React, {Component} from 'react';

import './searchHistory.css';

export default class SearchHistoryComponent extends Component{
    componentDidMount(){}
    render(){
        return (
            <div className="col-sm-12 section">
                <h3>Search History</h3>
                <div className="history-window">
                    <span>No Search History</span>
                </div>
                <form className="form-horizontal">
                    <div className="form-group">
                        <label className="col-sm-3 control-label">Display which cohort</label>
                        <div className="col-sm-5">
                            <select className="form-control" name="cohort">
                                <option value="all">Results of last search</option>
                            </select>
                        </div>
                    </div>
                </form>
                <div className="result-window">
                    <span>No Results</span>
                </div>
            </div>
        );
    }
}
