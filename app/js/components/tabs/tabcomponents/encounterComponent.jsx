import React, {Component, PropTypes} from 'react';
import shortId from 'shortid';

const FORMS_API_ENDPOINT = '/form';
const LOCATIONS_API_ENDPOINT = '/location';
const ENCOUNTER_TYPES_API_ENDPOINT = '/encountertype';

class EncounterComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            locations: [],
            encouterTypes: [],
            forms: []
        };
    }

    componentWillMount(){
        this.props.fetchData(FORMS_API_ENDPOINT)
          .then(response => {
              const displayData = [];
              response.results.map(result=>{
                  displayData.push({id: result.uuid, value: result.display});
              });
              this.setState({forms: displayData});
          });

        this.props.fetchData(LOCATIONS_API_ENDPOINT)
          .then(response => {
              const displayData = [];
              response.results.map(result=>{
                  displayData.push({id: result.uuid, value: result.display});
              });
              this.setState({locations: displayData});
          });

        this.props.fetchData(ENCOUNTER_TYPES_API_ENDPOINT)
          .then(response => {
              const displayData = [];
              response.results.map(result=>{
                  displayData.push({id: result.uuid, value: result.display});
              });
              this.setState({encouterTypes: displayData});
          });
    }

    displaySelectOption(data){
        return (
            <option value={data.id} key={shortId.generate()}>{data.value}</option>
        );
    }

    render(){
        return (
            <div className="encounter-component">
              <h3>Search by encounter</h3>
              <div>
                <h4 className="text-center">Patients having encounters</h4>
                <form className="form-horizontal text-center">
                  <div className="form-group">
                    <label htmlFor="type" className="col-sm-2 control-label">
                      Of Type
                    </label>
                    <div className="col-sm-6">
                      <select multiple="multiple" name="type" id="type" className="form-control">
                        {this.state.encouterTypes.map(encounterType => this.displaySelectOption(encounterType))}
                      </select>
                      { }
                    </div>
                    <span className="inline-label">(Leave blank for all encounter types)</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="location" className="col-sm-2 control-label">At Location</label>
                    <div className="col-sm-3">
                        <select className="form-control" id="location">
                            {this.state.locations.map(location => this.displaySelectOption(location))}
                        </select>
                    </div>
                    <span className="inline-label">(Optional)</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="form" className="col-sm-2 control-label">From Form</label>
                    <div className="col-sm-3">
                        <select className="form-control" id="form">
                            {this.state.forms.map(form => this.displaySelectOption(form))}
                        </select>
                    </div>
                    <span className="inline-label">(Optional)</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="atLeast" className="col-sm-2 control-label">Atleast this many: </label>
                    <div className="col-sm-3">
                        <input type="number" className="form-control" id="atLeast"/>
                    </div>
                    <label htmlFor="atMost" className="col-sm-2 control-label">Upto this many: </label>
                    <div className="col-sm-3">
                        <input type="number" className="form-control" id="atMost"/>
                    </div>
                    <span className="inline-label">(Optional)</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="atLeast" className="col-sm-2 control-label">Within the last: </label>
                    <div className="col-sm-3">
                        <input type="number" className="form-control" id="atLeast"/>
                    </div>
                    <label htmlFor="atMost" className="col-sm-2 control-label">month(s) and : </label>
                    <div className="col-sm-3">
                        <input type="number" className="form-control" id="atMost"/>
                    </div>
                    <span className="inline-label">days    (Optional)</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="since" className="col-sm-2 control-label">Since: </label>
                    <div className="col-sm-3">
                       <input type="number" className="form-control" id="atLeast"/>
                    </div>
                    <label htmlFor="until" className="col-sm-2 control-label">Until: </label>
                    <div className="col-sm-3">
                        <input type="number" className="form-control" id="atMost"/>
                    </div>
                    <span className="inline-label">day(s)    (Optional)</span>
                  </div>

                  <div className="form-group submit-btn">
                    <div className="col-sm-offset-2 col-sm-6">
                      <button type="submit" className="btn btn-success">Search</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
        );
    }
}

EncounterComponent.propTypes = {
    fetchData: PropTypes.func.isRequired
};

export default EncounterComponent;
