import React, { Component } from 'react';
import shortId from 'shortid';

class DrugOrderComponent extends Component {
    constructor() {
        super();
        this.state = {
            drugs: []
        };
    }

    componentWillMount() {
        this.props.fetchData('/drug')
            .then(data => {
                this.setState({drugs: data.results});
            });
    }

    getOptions() {
        const allOptions = this.state.drugs.map((each) =>
            <option value={each.uuid} key={shortId.generate()}>{each.display}</option>
         );
         return allOptions;
    }

    render() {
        return (
            <div>
                <h3>Patients taking specific drugs</h3>
                <form className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="drug" className="col-sm-2 control-label">Drug(s)</label>
                        <div className="col-sm-6">
                            <select className="form-control" multiple="multiple" id="drug" name="drug">
                                {this.getOptions()}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-sm-2 control-label">Drug Regimen</label>
                        <div className="col-sm-6">
                            <label className="radio-inline">
                                <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"/> Current Drug Regimen
                            </label>
                            <label className="radio-inline">
                                <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"/> specific Drug Regimen(s)
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-sm-2 control-label">When?</label>
                        <div className="col-sm-2">
                            <span className="inline-label">Within the last:</span>
                        </div>
                        <div className="col-sm-2">
                            <input className="form-control" type="text" name="month" />
                        </div>
                        <span className="inline-label">months and :</span>
                        <div className="col-sm-2">
                            <input className="form-control" name="days" type="text" />
                        </div>
                        <span className="inline-label">days    (optional)</span>
                    </div>

                    <div className="form-group">
                        <label className="col-sm-2 control-label">Date Range</label>
                        <div className="col-sm-1">
                            <span className="inline-label">From:</span>
                        </div>
                        <div className="col-sm-3">
                            <input className="form-control" type="date" name="from-date" />
                        </div>
                        <span className="inline-label">To:</span>
                        <div className="col-sm-3">
                            <input className="form-control" name="to-date" type="date" />
                        </div>
                        <span className="inline-label">(optional)</span>
                    </div>

                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-6">
                            <button type="submit" className="btn btn-success">Search</button>
                        </div>
                    </div>
                </form>
                <br/>
                <h3>Patients who stopped or changed a drug</h3>
                <form className="form-horizontal">
                    <div className="form-group">
                        <label className="col-sm-2 control-label">When?</label>
                        <div className="col-sm-2">
                            <span className="inline-label">Within the last:</span>
                        </div>
                        <div className="col-sm-2">
                            <input className="form-control" type="text" name="month" />
                        </div>
                        <span className="inline-label">months and :</span>
                        <div className="col-sm-2">
                            <input className="form-control" name="days" type="text" />
                        </div>
                        <span className="inline-label">days(optional)</span>
                    </div>

                    <div className="form-group">
                        <label className="col-sm-2 control-label">Date Range</label>
                        <div className="col-sm-1">
                            <span className="inline-label">From:</span>
                        </div>
                        <div className="col-sm-3">
                            <input className="form-control" type="date" name="from-date" />
                        </div>
                        <span className="inline-label">To:</span>
                        <div className="col-sm-3">
                            <input className="form-control" name="to-date" type="date" />
                        </div>
                        <span className="inline-label">(optional)</span>
                    </div>
                    <br/><br/>
                    <div className="form-group">
                        <div className="col-md-4">
                            <p className="text-center">Reason(s) for change</p>
                            <select className="form-control" multiple="multiple" id="drug" name="drug">
                                <option value="1">Reason 1</option>
                                <option value="2">Reason 2</option>
                                <option value="3">Reason 3</option>
                                <option value="4">Reason 4</option>
                                <option value="5">Reason 5</option>
                                <option value="6">Reason 6</option>
                                <option value="7">Reason 7</option>
                                <option value="8">Reason 8</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <p className="text-center">Only these drugs</p>
                            <select className="form-control" multiple="multiple" id="drug" name="drug">
                                {this.getOptions()}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <p className="text-center">Only these generics</p>
                            <select className="form-control" multiple="multiple" id="drug" name="drug">
                                <option value="1">Generic 1</option>
                                <option value="2">Generic 2</option>
                                <option value="3">Generic 3</option>
                                <option value="4">Generic 4</option>
                                <option value="5">Generic 5</option>
                                <option value="6">Generic 6</option>
                                <option value="7">Generic 7</option>
                                <option value="8">Generic 8</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-5 col-sm-2">
                            <button type="submit" className="btn btn-success">Search</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default DrugOrderComponent;