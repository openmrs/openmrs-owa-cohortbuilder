import React, {Component} from 'react';

import './searchHistory.css';

export default class SearchHistoryComponent extends Component{
    componentDidMount(){}
    render(){
        return (
            <div className="search-history">
                <h2>Search History</h2>
                <div className="history-window">
                    <span>No Search History</span>
                </div>
                <div className="select-display">
                    <label htmlFor="">Display which cohort:
                    <select name="" id="">
                        <option value="">Results of last search</option>
                    </select>
                </label>
                </div>
                <div className="result-window">
                    <span>No Results</span>
                </div>
            </div>
        );
    }
}
