import React, {Component} from 'react';

class ProgrammeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            programs: [],
            workflows: [],
            states: [],
            locations: [],
            methods: []
        };
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
        })
    }
    // Get program workflows for the program selected
    getWorkflow() {
        const program = document.getElementById("select-program").value;
        this.props.fetchData(`/program/${program}`).then(data => {
            this.setState({
                workflows: data.allWorkflows
            });
            this.getStates(data.allWorkflows);
        });
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
                <option key={program.uuid} value={program.name}>
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
        })
        // States will be loaded from this.state.states when populated from backend
        let states = "<option> </option>";

        let locations = this.state.locations.map((location) => {
            return (
                <option key={location.uuid} value={location.uuid}>
                    {location.display}
                </option>        
            )
        })

        // Methods will be loadd from this.state.methods populated from the backend.
        let methods = "<option> </option>";
    return (
        <div className="programme-component">
            <h3>Search By Program Enrollement and Status</h3>
            <form className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="gender" className="col-sm-2 control-label">Program:</label>
                    <div className="col-sm-6">
                        <select onChange={() => {this.getWorkflow()}} className="form-control" id="select-program" name="">
                            <option value="all">All</option>
                            { programs }
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="gender" className="col-sm-2 control-label">Workflow:</label>
                    <div className="col-sm-6">
                        <select className="form-control" id="gender" name="gender">
                            <option value="all">All</option>
                            { workflows }
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="gender" className="col-sm-2 control-label">State:</label>
                    <div className="col-sm-6">
                        <select className="form-control" id="gender" name="gender">
                            <option value="all">All</option>
                            { states }
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-2 control-label">Age</label>
                   
                    <div className="col-sm-1">
                         <span className="inline-label">Between:</span>
                    </div>
                    <div className="col-sm-3">
                        <input  type="date" className="form-control" />
                    </div>
                    <span className="inline-label">And:</span>
                    <div className="col-sm-3">
                        <input type="date" className="form-control" />
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-2 control-label">In the programme</label>
                   
                    <div className="col-sm-1">
                         <span className="inline-label">On or after:</span>
                    </div>
                    <div className="col-sm-3">
                        <input className="form-control" type="date" name="from-date" />
                    </div>
                    <span className="inline-label">On or before:</span>
                    <div className="col-sm-3">
                        <input className="form-control" name="to-date" type="date" />
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-2 control-label">Enrolled in the programme</label>
                   
                    <div className="col-sm-1">
                         <span className="inline-label">On or after:</span>
                    </div>
                    <div className="col-sm-3">
                        <input className="form-control" type="date" name="from-date" />
                    </div>
                    <span className="inline-label">On or before:</span>
                    <div className="col-sm-3">
                        <input className="form-control" name="to-date" type="date" />
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-2 control-label">Completed in the programme</label>
                   
                    <div className="col-sm-1">
                         <span className="inline-label">On or after:</span>
                    </div>
                    <div className="col-sm-3">
                        <input className="form-control" type="date" name="from-date" />
                    </div>
                    <span className="inline-label">On or before:</span>
                    <div className="col-sm-3">
                        <input className="form-control" name="to-date" type="date" />
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
                        <select className="form-control" id="" name="">
                            <option value="all">All</option>
                            { locations }
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="gender" className="col-sm-2 control-label">According to Method:</label>
                    <div className="col-sm-6">
                        <select className="form-control" id="" name="">
                            <option value="all">All</option>
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

export default ProgrammeComponent;