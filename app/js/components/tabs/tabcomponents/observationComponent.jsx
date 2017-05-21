import React, {Component} from 'react';
import DatePicker from "react-bootstrap-date-picker";
import { JSONHelper } from '../../../helpers/jsonHelper';

class ObservationComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchParam: {},
            searchResults: {},
            startDate: '',
            endDate: ''
        }
        this.searchObservation = this.searchObservation.bind(this);
        this.getFormData = this.getFormData.bind(this);
        this.jsonHelper = new JSONHelper();
        this.handleDateChange = this.handleDateChange.bind(this);
        this.getDateString = this.getDateString.bind(this);
    }
    componentDidMount(){}
    getFormData(fields) {
      const searchParams = {};
      for(const eachField in fields) {
        if(Array.isArray(fields[eachField])) {
            fields[eachField].forEach((fieldInput, index) => {
                let fieldValue = $('#obsForm').find('#'+fieldInput.name).val();
                fields[eachField][index].value = (fields[eachField][index].isArrayValue && fieldValue != '')
                    ? [ fieldValue ]
                    : fieldValue;
            });
            searchParams[eachField] = fields[eachField];
            continue;
        }
      }
      return searchParams;
    }
    searchObservation(e) {
        e.preventDefault();
        const startDate = this.state.startDate;
        const endDate = this.state.endDate;
        const timeModifier = document.getElementById('timeModifier').value;
        let historyTitle = (timeModifier === "ANY")
            ? `Patients with ${this.props.conceptName.name}`
            : `Patients without ${this.props.conceptName.name}`;
        const fields = {
            codedObsSearchAdvanced : [
                { name: 'question'},
                { name: 'timeModifier'}
            ]
        };
        if(startDate !== "") {
            historyTitle += ` since ${startDate}`;
            fields.codedObsSearchAdvanced.push({ name: 'startDate'});
        }
        if(endDate !== "") {
            historyTitle += ` until ${endDate}`;
            fields.codedObsSearchAdvanced.push({ name: 'endDate'});
        }

        const searchParams = this.getFormData(fields);
        this.setState({
            searchResults: searchParams
        });
        const searchData = this.jsonHelper.composeJson(searchParams);
        this.props.search(searchData).then(results => {
            const obsType = results.rows || [];
            this.props.addToHistory(historyTitle, obsType, results.query);
        });
    }

    /**
     * Method to update the date key for different date types in the state
     * @param {String} stateKey - The key in the component state that should be
     * updated
     * @return {Function} - Call back function to be executed by the date input
     * field
     */
    handleDateChange(dateType) {
        return value => this.setState({
            [dateType]: this.getDateString(value)
        });
    }

    /**
     * Method to get the date in the format MM-DD-YY from a date isoString
     * @param {String} isoString - Date in isoString format
     * @return {String} MM-DD-YY date formatted string
     */
    getDateString(isoString) {
        return isoString ? isoString.split('T')[0]: '';
    }

    render(){
        return (
            <div id="observations-wrapper" className="conceptTabs">
                <hr />
                <div>
                    <form className="form-horizontal col-sm-12" id="obsForm">
                        <div className="observationTitle">
                            <h3>Patients with observations whose answer is {this.props.conceptName.name} </h3>
                            <input type="hidden" id="question" value={this.props.conceptName.uuid} />
                        </div>
                        <div className="form-group">
                            <div className="col-sm-6 col-sm-offset-3">
                                <select className="form-control" id="timeModifier">
                                    <option value="ANY">Patients who have these observations</option>
                                    <option value="NO">Patients who do not have these observations</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group col-sm-12">
                            <label className="col-sm-3 control-label">When? Within the last:</label>
                            <div className="col-sm-3">
                                <input className="form-control" placeholder="Months" type="text" name="values" id="values" />
                            </div>
                            <label className="col-sm-2 control-label">and/or</label>
                            <div className="col-sm-3">
                                <input className="form-control" placeholder="Days" type="text" name="values" id="values" />
                            </div>
                            <h5 className="col-sm-1">Optional</h5>
                        </div>
                        <div className="form-group col-sm-12">
                            <label className="col-sm-3 control-label">Date Range? Since:</label>
                            <div className="col-sm-3">
                                <DatePicker
                                    className="form-control"
                                    id="startDate"
                                    dateFormat="DD-MM-YYYY"
                                    value={this.state.startDate}
                                    onChange={this.handleDateChange('startDate')}
                                />
                            </div>
                            <label className="col-sm-2 control-label">and/or Until:</label>
                           <div className="col-sm-3">
                               <DatePicker
                                    className="form-control"
                                    id="endDate"
                                    dateFormat="DD-MM-YYYY"
                                    value={this.state.endDate}
                                    onChange={this.handleDateChange('endDate')}
                                />
                            </div>
                            <h5 className="col-sm-1">Optional</h5>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-3 col-sm-6">
                                <button type="submit" className="btn btn-success" onClick={this.searchObservation}>Search</button>
                                <button type="reset" className="btn btn-default cancelBtn">Reset</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

ObservationComponent.propTypes = {
    search: React.PropTypes.func.isRequired,
    addToHistory: React.PropTypes.func.isRequired,
    conceptName: React.PropTypes.object.isRequired
};

export default ObservationComponent;