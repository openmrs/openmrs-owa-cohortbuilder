import React, {Component} from 'react';
import shortId from 'shortid'

import './searchHistory.css';

class SearchHistoryComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchHistory : []
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({searchHistory: nextProps.history});
    }

    render(){
        return (
            <div className="col-sm-12 section">
                <h3>Search History</h3>
                <div className="result-window">
                    {
                        (this.state.searchHistory.length > 0) ?
                            <table className="table table-hover">
                                <tbody>
                                    {
                                        this.state.searchHistory.map((eachResult) =>
                                            <tr key={shortId.generate()}>
                                                <td>{eachResult.description}</td>
                                                <td>{eachResult.total +' result(s)'}</td>
                                                <td><span className="glyphicon glyphicon-glyphicon glyphicon-floppy-disk save" aria-hidden="true"></span></td>
                                                <td className="view-result">View</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                            : <p className="text-center">No search History</p>
                    }
                </div>
            </div>
        );
    }
}
export default SearchHistoryComponent;
