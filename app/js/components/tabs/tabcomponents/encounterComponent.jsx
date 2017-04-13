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
            forms: [],
            searchResults: [],
            currentPage: 1,
            toDisplay: [],
            totalPage: 0,
            perPage: 10
        };
        this.searchByEncounter = this.searchByEncounter.bind(this);
        this.getFormValues = this.getFormValues.bind(this);
        this.navigatePage = this.navigatePage.bind(this);
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
            <option value={data.value} key={shortId.generate()}>{data.value}</option>
        );
    }

    getFormValues(fields) {
      const searchParams = {};
      for(const eachField in fields) {
        if(Array.isArray(fields[eachField])) {
            fields[eachField].forEach((fieldInput, index) => {
                fields[eachField][index].value = [document.getElementById(fieldInput.name).value];
            });
            searchParams[eachField] = fields[eachField];
            continue;
        }
      }
      return searchParams;
    }

    searchByEncounter(event) {
      event.preventDefault();
      const fields = {
          anyEncounterOfTypesDuringPeriod : [
              { name: 'encounterTypes' }
          ]
      };

      const searchParams = this.getFormValues(fields);


      this.props.search(searchParams).then(results => {
          const allEncounterTypes = results.rows;
          const pageEncounterTypes = this.getPatientDetailsPromises(allEncounterTypes, this.state.currentPage);
          this.setState({toDisplay: pageEncounterTypes, searchResults: allEncounterTypes, totalPage: Math.ceil(allEncounterTypes.length/this.state.perPage)});
          this.props.addToHistory(results.searchDescription, allEncounterTypes.length, searchParams);
      });
    }

    navigatePage(event) {
        event.preventDefault();
        let pageToNavigate = 0;
        switch(event.target.value) {
            case 'first': pageToNavigate = 1; break;
            case 'last': pageToNavigate = this.state.totalPage; break;
            default: pageToNavigate = (event.target.value === 'next') ? this.state.currentPage+1 : this.state.currentPage-1;
        }
        const pageEncounterTypes = this.getPatientDetailsPromises(this.state.searchResults, pageToNavigate);
        this.setState({ toDisplay: pageEncounterTypes, currentPage: pageToNavigate });
    }

    getPatientDetailsPromises(allEncounterTypes, currentPage) {
        const pageEncounterTypes = [];
        for(let index = (currentPage-1) * this.state.perPage; index < currentPage * this.state.perPage && index < allEncounterTypes.length; index++) {
            pageEncounterTypes.push(
                allEncounterTypes[index]
            );
        }
        return pageEncounterTypes;
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
                      <select multiple="multiple" name="encounterTypes" id="encounterTypes" className="form-control">
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
                      <button type="submit" className="btn btn-success" onClick={this.searchByEncounter}>Search</button>
                    </div>
                  </div>
                </form>
                <hr/>
              </div>
            </div>
        );
    }
}

EncounterComponent.propTypes = {
    fetchData: PropTypes.func.isRequired
};

export default EncounterComponent;
