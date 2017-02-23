import React, {Component} from 'react';

class ConceptComponent extends Component {
    componentDidMount(){}
    render(){
        return (
            <div>
                <h3>Search By Demographic</h3>
                <form className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="gender" className="col-sm-4 control-label">Search by Concepts and Observations</label>
                        <div className="col-sm-4">
                            <input type="text" className="form-control" placeholder="Input Value"/>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-sm-offset-4 col-sm-6">
                            <div className="checkbox verbose">
                                <label>
                                    <input type="checkbox" value="verbose"/> Include Verbose
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-sm-offset-4 col-sm-6">
                            <button type="submit" className="btn btn-success">Search</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default ConceptComponent;