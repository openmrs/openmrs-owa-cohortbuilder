import React, {Component} from 'react';

class ConceptComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptsResults: [],
            searchResults: [],
            verbose: false
        };
        this.allConcepts = [];
        this.searchConcept = this.searchConcept.bind(this);
        this.checkVerbose = this.checkVerbose.bind(this);
        this.loadConcepts = this.loadConcepts.bind(this);
    }
    /**
     * Check if verbose is clicked and set verbose state to true
     * @param {*} event 
     */
    checkVerbose(event) {
        const verbose = document.getElementById('verbose').checked;
        this.setState({
            verbose: verbose
        })
    }
    /**
     * Load concepts suggestions from the backend based on entered input
     * entered keyword
     * @param {*} event 
     */
    loadConcepts(event) {
            const conceptName = event.target.value,
                regex = new RegExp(conceptName, 'gi')
            if(conceptName.length > 2){
                this.allConcepts = [];
                new Promise((resolve, reject) => {
                    this.props.fetchData('/concept?v=full').then(data => {
                        data.results.map(concept => {
                            const name = concept.display.toUpperCase();
                            const searchInput = conceptName.toUpperCase();
                            if(!!name.match(searchInput)) {
                                const conceptData = {name: concept.display, description: concept.descriptions[0].description}
                                let found = false;
                                this.allConcepts.map(item => {
                                    if(item.name === conceptData.name) {
                                        found = true;
                                    }
                                })
                                if(!found) {
                                    this.allConcepts.push(conceptData);
                                }
                            }
                        })
                        resolve(this.allConcepts);
                    });
                }).then((res) => {
                    this.setState({
                        conceptsResults: res
                    });
                })
            } else{
                this.setState({
                    conceptsResults: []
                });
            }
    }
    /**
     * Search concepts based on the selected concept
     * @TODO: make search request to fetch observations
     * for patients belonging to the selected concept
     * @param {*} event 
     */
    searchConcept(event) {
        event.preventDefault();
        searchQuery = event.target.textContent;
    }
    render(){
        let concept = (this.state.conceptsResults.length > 0)
            ? this.state.conceptsResults.map((concept) => {
            return (
                <tbody key={this.state.conceptsResults.indexOf(concept) + Math.random()} value={concept.name}>
                <tr>
                    <td id="concept-name" onClick={this.searchConcept}>
                        {concept.name}
                    </td>
                </tr>
                {(this.state.verbose ?
                    <tr>
                        <td id="concept-verbose">
                            {concept.description}
                        </td>
                    </tr>
                    : null
                )}
                </tbody>
            );
        })
        : null;
        let conceptResults = (this.state.conceptsResults.length > 0)
            ? this.state.conceptsResults.map(concept => {
                return(
                    <option key={this.state.conceptsResults.indexOf(concept)} onClick={this.searchConcept} value={concept}></option>
                )
            })
            : null;
        return (
            <div>
                <h3>Search By Demographic</h3>
                <form className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="gender" className="col-sm-4 control-label">Search by Concepts and Observations</label>
                        <div className="col-sm-4">
                            <input type="text" name="concepts" id="conceptValue" onChange={this.loadConcepts} className="form-control" placeholder="Input Value"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-4 col-sm-6">
                            <div className="checkbox verbose">
                                <label>
                                    <input id="verbose" type="checkbox" onChange={this.checkVerbose} value="verbose"/> Include Verbose
                                </label>
                            </div>
                        </div>
                    </div>
                </form>
                {((this.state.conceptsResults.length > 0) ?
                    <div>
                        <div className="result row col-sm-8 col-sm-offset-2">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>CONCEPT AND OBSERVATIONS</th>
                                </tr>
                            </thead>
                                { concept }
                            </table>
                        </div>
                    </div>
                    :
                    null
                )}
            </div>
        );
    }
}

export default ConceptComponent;