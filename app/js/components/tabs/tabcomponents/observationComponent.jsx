import React, {Component} from 'react';

class ObservationComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount(){}
    render(){
        return (
            <div id="observations-wrapper" className="conceptTabs">
                <hr />
                <div>
                    <div className="observationTitle">
                        <h3>Patients with observations whose answer is {this.props.conceptName} </h3>
                    </div>
                    <form className="form-horizontal col-sm-12">
                        <div className="form-group">
                            <div className="col-sm-6 col-sm-offset-3">
                                <select className="form-control" id="observationType">
                                    <option value="all">Patients who have these observations</option>
                                    <option value="none">Patients who do not have these observations</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group col-sm-12">
                            <label className="col-sm-4 control-label">When? Within the last:</label>
                            <div className="col-sm-2">
                                <input className="form-control" placeholder="Months" type="text" name="values" id="values" />
                            </div>
                            <label className="col-sm-2 control-label">and/or</label>
                           <div className="col-sm-2">
                                <input className="form-control" placeholder="Days" type="text" name="values" id="values" />
                            </div>
                            <h5>*Optional</h5>
                        </div>
                        <div className="form-group col-sm-12">
                            <label className="col-sm-4 control-label">Date Range? Since:</label>
                            <div className="col-sm-2">
                                <input className="form-control" placeholder="Date" type="text" name="values" id="values" />
                            </div>
                            <label className="col-sm-2 control-label">and/or Until:</label>
                           <div className="col-sm-2">
                                <input className="form-control" placeholder="Date" type="text" name="values" id="values" />
                            </div>
                            <h5>*Optional</h5>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-5 col-sm-6">
                                <button type="submit" className="btn btn-success">Search</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default ObservationComponent;