import React, {Component} from 'react';
import { JSONHelper } from '../../../helpers/jsonHelper';
import { ApiHelper } from '../../../helpers/apiHelper';
class ProgrammeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            programs: [],
            workflows: [],
            states: [],
            locations: [],
            methods: [],
            minAge: '',
            maxAge: '',
            enrolledStartDate: '',
            enrolledEndDate: '',
            completedStartDate: '',
            completedEndDate: '',
            inStartDate: '',
            inEndDate: '',
            state: '',
            program: '',
            workflow: ''
        };
        this.searchByProgram = this.searchByProgram.bind(this);
        this.handleSelectProgram = this.handleSelectProgram.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    // Make a call to the program endpoint to get backend field data when component mounts
    componentDidMount(props) {
        this.props.fetchData('/program').then(data => {
            this.setState({
                programs: data.results
            });
        });
        this.props.fetchData('/location').then(location => {
            this.setState({
                locations: location.results
            });
        });
    }

    /**
     * Method to handle Search by programs events/actions
     * @param {Object} event - Object containing data about this event
     * @return {undefined} - returns undefined
     */
    searchByProgram(event) {
        event.preventDefault();
        const jsonHelper = new JSONHelper();
        const jsonQuery = jsonHelper.composeJson(this.createSearchByProgramParmeters());
        // generate custom search query and search label
        if(this.state.inStartDate || this.state.inEndDate) {
            const initialNumberOfFilters = jsonQuery.query.rowFilters.length;
            jsonQuery.query.rowFilters.push(
                {
                    "type": "org.openmrs.module.reporting.cohort.definition.PatientDataDefinition",
                    "key": "reporting.library.cohortDefinition.builtIn.programEnrollment",
                    "parameterValues": {
                        "enrolledEndDate":this.state.inStartDate || this.state.inEndDate
                    }
                }
            );

            jsonQuery.query.rowFilters.push(
                {
                    "type": "org.openmrs.module.reporting.cohort.definition.PatientDataDefinition",
                    "key": "reporting.library.cohortDefinition.builtIn.programEnrollment",
                    "parameterValues": {
                        "completedEndDate":this.state.inEndDate || this.state.inStartDate
                    }
                }
            );
            jsonQuery.query.customRowFilterCombination = (initialNumberOfFilters === 1) ? '(1 and 2) and not 3' : '(1 and 2 and 3) and not 4';          
        }
        new ApiHelper().post('reportingrest/adhocquery?v=full', jsonQuery.query).then(response => {
            this.props.addToHistory(this.composeLabel(), response.rows);
        });
    }

    /**
     * Helper Method to compose a description for any programme enrollment
     * search.
     * @return {undefined} - Descriptive label for this search request
     */
    composeLabel() {
        const element = document.getElementById(this.state.program);
        const program =  element ? element.innerText : 'all programs';
        let label = `Patients in ${program}`;
        if (this.state.minAge || this.state.maxAge) {
            label += `, born between ${this.state.minAge} & ${this.state.maxAge}`;
        }
        if (this.state.inEndDate || this.state.inStartDate) {
            label += this.composerHelper('inStartDate', 'inEndDate', 'were in');
        }

        if (this.state.enrolledEndDate || this.state.enrolledStartDate) {
            label += this.composerHelper('enrolledStartDate', 'enrolledEndDate', 'enrolled in');
        }

        if (this.state.enrolledEndDate || this.state.enrolledStartDate) {
            label += this.composerHelper('completedStartDate', 'completedEndDate', 'completed');
        }

        return label;
    }
    /**
     * Helper function to compose a repeating part of different searches label
     * @param {String} startProperty 
     * @param {String} endProperty 
     * @param {String} inLabel 
     * @return {String} - part of the label
     */
    composerHelper(startProperty, endProperty, inLabel) {
        let label = ` and ${inLabel} the programme`;
        if (this.state[startProperty] && this.state[endProperty]) {
            label += ` between ${this.state[startProperty]} & ${this.state[endProperty]}`;
        } else if (this.state[endProperty])  {
            label += ` before ${this.state[endProperty]}`;
        } else {
            label += ` after ${this.state[startProperty]}`;
        }  
        return label; 
    }

    /**
     * Method to handle events fired when a program is selected.
     * It passes the selected program to the getWorkflow method
     * @param {Object} event - Event Object containing data about this event
     * @return {undefined} - return undefined
     */
    handleSelectProgram(event) {
        event.preventDefault();
        const program = event.target.value;
        this.setState({ program });
        this.getWorkflow(program);
    }

    /**
     * Method to hanlde events fired by input elements in this components forms
     * It sets the input elements value to the corresponding state value
     * @param {Object} event - Event object containing data about this event
     * @return {undefined} - returns undefined
     */
    handleInputChange(event) {
        event.preventDefault();
        this.setState({[event.target.id]: event.target.value});
    }

    /**
     * Method to create necessary structured object containing parameters for 
     * a Program based search
     * @return {Object} - Object holding necessary parameters for the search
     */
    createSearchByProgramParmeters() {
        const parameters = {
            programEnrollment: []
        };
        if (this.state.maxAge || this.state.minAge) {
            parameters.bornDuringPeriod = [];
            if (this.state.minAge) {
                parameters.bornDuringPeriod.push({
                    name: 'startDate', dataType: 'date', value: this.state.minAge
                });
            }
            if (this.state.maxAge) {
                parameters.bornDuringPeriod.push({
                    name: 'endDate', dataType: 'date', value: this.state.maxAge
                });
            }
        }
        if (this.state.program) {
            parameters.programEnrollment.push({
                name: 'programs',
                type: 'program',
                value: [this.state.program]
            });
        }
         if (this.state.enrolledStartDate) {
            parameters.programEnrollment.push({
                name: 'enrolledStartDate',
                type: 'date',
                value: this.state.enrolledStartDate
            });
        }
        if (this.state.enrolledEndDate) {
            parameters.programEnrollment.push({
                name: 'enrolledEndDate',
                type: 'date',
                value: this.state.enrolledEndDate
            });
        }
        if (this.state.completedStartDate) {
            parameters.programEnrollment.push({
                name: 'completedStartDate',
                type: 'date',
                value: this.state.completedStartDate
            });
        }
        if (this.state.completedEndDate) {
            parameters.programEnrollment.push({
                name: 'completedEndDate',
                type: 'date',
                value: this.state.completedEndDate
            });
        }
        return parameters;
    }

    // Get program workflows for the program selected
    getWorkflow(program) {
        if (program) {
            this.props.fetchData(`/program/${program}`).then(data => {
                this.setState({
                    workflows: data.allWorkflows
                });
                this.getStates(data.allWorkflows);
            });
        } else {
            this.setState({ workflows: [], workflow: '' });
        }
    }
    // Get the states from the workflow.
    getStates(workflows) {
        /** Update state based on the data retreived from the workflows
         * @TODO: State data does not exist on the local, but exists on refapp,
         * try to populate states on the local
        */
        
    }
    render() {
        let programs = this.state.programs.map((program) => {
            return (
                <option key={program.uuid} value={program.uuid} id={program.uuid}>
                    {program.name}
                </option>
            );
        });
        let workflows = this.state.workflows.map((workflow) => {
            return (
                <option key={workflow.uuid} value={workflow.uuid}>
                    {workflow.concept.display}
                </option>
            );  
        });
        // States will be loaded from this.state.states when populated from backend
        let states = "<option> </option>";

        let locations = this.state.locations.map((location) => {
            return (
                <option key={location.uuid} value={location.uuid}>
                    {location.display}
                </option>        
            );
        });

        // Methods will be loadd from this.state.methods populated from the backend.
        let methods = "<option> </option>";
    return (
        <div className="programme-component">
            <h3>Search By Program Enrollement and Status</h3>
            <form className="form-horizontal" onSubmit={this.searchByProgram}>
                <div className="form-group">
                    <label htmlFor="gender" className="col-sm-2 control-label">Program:</label>
                    <div className="col-sm-6">
                        <select onChange={this.handleSelectProgram} className="form-control" id="program" name="program">
                            <option value="">All</option>
                            { programs }
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="gender" className="col-sm-2 control-label">Workflow:</label>
                    <div className="col-sm-6">
                        <select className="form-control" id="workflow" onChange={this.handleInputChange}>
                            <option value="">All</option>
                            { workflows }
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="gender" className="col-sm-2 control-label">State:</label>
                    <div className="col-sm-6">
                        <select className="form-control" id="state" onChange={this.handleInputChange}>
                            <option value="all">All</option>
                            { states }
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-2 control-label">Birth Date</label>
                   
                    <div className="col-sm-1">
                         <span className="inline-label">Between:</span>
                    </div>
                    <div className="col-sm-3">
                        <input id="minAge" type="date" className="form-control" onChange={this.handleInputChange}/>
                    </div>
                    <span className="inline-label">And:</span>
                    <div className="col-sm-3">
                        <input id="maxAge" type="date" className="form-control" onChange={this.handleInputChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-2 control-label">In the programme</label>
                   
                    <div className="col-sm-1">
                         <span className="inline-label">On or after:</span>
                    </div>
                    <div className="col-sm-3">
                        <input className="form-control" type="date" name="from-date" id="inStartDate" onChange={this.handleInputChange} />
                    </div>
                    <span className="inline-label">On or before:</span>
                    <div className="col-sm-3">
                        <input className="form-control" name="to-date" type="date" id="inEndDate" onChange={this.handleInputChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-2 control-label">Enrolled in the programme</label>
                   
                    <div className="col-sm-1">
                         <span className="inline-label">On or after:</span>
                    </div>
                    <div className="col-sm-3">
                        <input id="enrolledStartDate" className="form-control" type="date" name="from-date" onChange={this.handleInputChange} />
                    </div>
                    <span className="inline-label">On or before:</span>
                    <div className="col-sm-3">
                        <input id="enrolledEndDate" className="form-control" name="to-date" type="date" onChange={this.handleInputChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-2 control-label">Completed the programme</label>
                   
                    <div className="col-sm-1">
                         <span className="inline-label">On or after:</span>
                    </div>
                    <div className="col-sm-3">
                        <input id="completedStartDate" className="form-control" type="date" name="from-date" onChange={this.handleInputChange} />
                    </div>
                    <span className="inline-label">On or before:</span>
                    <div className="col-sm-3">
                        <input id="completedEndDate" className="form-control" name="to-date" type="date" onChange={this.handleInputChange}/>
                    </div>
                </div>
                
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-6">
                        <button type="submit" className="btn btn-success">Search</button>
                    </div>
                </div>
            </form>
            
            <h3>Search By Location</h3>
            <form className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="gender" className="col-sm-2 control-label">Patients belonging to?:</label>
                    <div className="col-sm-6">
                        <select className="form-control" id="location">
                            <option value="">Select Location </option>
                            { locations }
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="gender" className="col-sm-2 control-label">According to Method:</label>
                    <div className="col-sm-6">
                        <select className="form-control" id="method">
                            <option value="">Select Method </option>
                            { methods }
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-6">
                        <button type="submit" className="btn btn-success">Search</button>
                    </div>
                </div>
            </form>
        </div>
    );
    }
}

ProgrammeComponent.propTypes = {
    fetchData: React.PropTypes.func.isRequired,
    search: React.PropTypes.func.isRequired,
    addToHistory: React.PropTypes.func.isRequired
};

export default ProgrammeComponent;
