import React, {Component} from 'react';
import ObservationComponent from './observationComponent'

class ConceptComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptsResults: [],
            searchResults: [],
            verbose: false,
            pages: [],
            currentPage: 0,
            currentDisplay: [],
            selectedConcept: null
        };
        this.resultsPerPage = 10
        this.allConcepts = [];
        this.searchConcept = this.searchConcept.bind(this);
        this.checkVerbose = this.checkVerbose.bind(this);
        this.loadConcepts = this.loadConcepts.bind(this);
        this.displayNewPage = this.displayNewPage.bind(this);
        this.nextPreviousPage = this.nextPreviousPage.bind(this);
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
        const limit = this.resultsPerPage;
        this.setState({
            currentDisplay: [],
            selectedConcept: null
        })
        const currentIndex = this.state.currentPage;
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
                                const conceptData = {
                                    name: concept.display,
                                    description: concept.descriptions[0].description
                                }
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
                    const currentDisplay = [];
                    const pages = [];
                    this.setState({
                        conceptsResults: res
                    });
                    // Display first page
                    this.displayNewPage(1)

                    const pageLen = Math.ceil(res.length / this.resultsPerPage);
                    for (let i = 0; i < pageLen; i++) {
                        pages.push(i + 1);
                    }
                    this.setState({
                        pages: pages
                    })
                })
            } else{
                this.setState({
                    conceptsResults: []
                });
            }
    }
    /**
     * Display a new page based on page argument specified
     * @param {*} page 
     */
    displayNewPage(page){
        this.setState({
            currentPage: page
        })
        let currentDisplay = [];
        const offset = (page === 1) ? 0 : this.resultsPerPage * (page - 1);
        const allConceptNames = this.state.conceptsResults;
        for (let i = offset; i < offset + this.resultsPerPage; i++) {
            if(allConceptNames[i]) {
                currentDisplay.push(allConceptNames[i]);
            }
        }
        this.setState({
            currentDisplay: currentDisplay
        })
    }
    /**
     * Setup method for navigation using the pagination tab
     * @param {*} type 
     */
    nextPreviousPage(type) {
        let page = this.state.currentPage
        switch(type){
            case 'next':
                page = (page === Math.ceil(this.state.conceptsResults.length / this.resultsPerPage))
                    ? Math.ceil(this.state.conceptsResults.length / this.resultsPerPage)
                    : page += 1;
                this.displayNewPage(page);
                break;
            case 'previous':
                page = (page === 1)
                    ? 1
                    : page -= 1;
                this.displayNewPage(page);
                break;
            case 'first':
                page = 1;
                this.displayNewPage(page);
                break;
            case 'last':
                page = Math.ceil(this.state.conceptsResults.length / this.resultsPerPage);
                this.displayNewPage(page);
                break;
            default:
                break;
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
        const searchQuery = event.target.textContent;
        this.setState({
            selectedConcept: searchQuery
        })
    }
    render(){
        let concept = (this.state.currentDisplay.length > 0)
            ? this.state.currentDisplay.map((concept) => {
            return (
                <tbody
                    key={this.state.currentDisplay.indexOf(concept) + Math.random()}
                    value={concept.name}>
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
        const resultPages = (this.state.pages.length > 0)
            ? this.state.pages.map(page => {
                return(
                    <li className = {
                        (this.state.currentPage === page)
                            ? 'active'
                            : '' 
                        } key={page} onClick={() => {this.displayNewPage(page)}}>
                            <a>{page}</a>
                    </li>
                )
            }) : null;
        let conceptResults = (this.state.conceptsResults.length > 0)
            ? this.state.conceptsResults.map(concept => {
                return(
                    <option
                        key={this.state.conceptsResults.indexOf(concept)}
                        onClick={this.searchConcept}
                        value={concept}>
                    </option>
                )
            })
            : null;
        return (
            // display search results based on the value of selectedConcept
            <div>
                <div>
                    <h3>Search By Demographic</h3>
                    <form className="form-horizontal">
                        <div className="form-group">
                            <label htmlFor="gender" className="col-sm-4 control-label">
                                Search by Concepts and Observations
                            </label>
                            <div className="col-sm-4">
                                <input
                                    type="text"
                                    name="concepts"
                                    id="conceptValue"
                                    onChange={this.loadConcepts}
                                    className="form-control"
                                    placeholder="Input Value"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-4 col-sm-6">
                                <div className="checkbox verbose">
                                    <label>
                                        <input
                                            id="verbose"
                                            type="checkbox"
                                            onChange={this.checkVerbose}
                                            value="verbose"/> Include Verbose
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>
                    {((this.state.conceptsResults.length > 0 && this.state.selectedConcept === null) ?
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
                                <div>
                                { (resultPages && resultPages.length > 1)
                                    ?   <ul className="pagination">
                                            <li><a onClick={() => {this.nextPreviousPage('first') }}>first</a></li>
                                            <li ><a onClick={() => {this.nextPreviousPage('previous') }}>&laquo;</a></li>
                                            { resultPages }
                                            <li><a onClick={() => {this.nextPreviousPage('next') }}>&raquo;</a></li>
                                            <li><a onClick={() => {this.nextPreviousPage('last') }}>last</a></li>
                                        </ul>
                                    : null
                                }
                                </div>
                            </div>
                        </div>
                        :
                        null
                    )}
                </div>
                {(this.state.selectedConcept)
                    ? <ObservationComponent conceptName={this.state.selectedConcept} />
                    : null
                }
            </div>
        );
    }
}

export default ConceptComponent;