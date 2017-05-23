import React, { Component, PropTypes } from 'react';
import { ApiHelper } from '../../../helpers/apiHelper';
import { JSONHelper } from '../../../helpers/jsonHelper';

class CompositionComponent extends Component {
    constructor(props) {
        super();
        this.state = {
            hasCompositionError: false,
            hasDescriptionError: false
        };
        this.performComposition = this.performComposition.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {/* important for test*/ }

    
    /**
     * The function takes the input of the text field and makes a search
     * @param {object} event 
     */
    performComposition(event) {
        event.preventDefault();
        const search = document.getElementById('composition-search-query')
            .value
            .replace(/(\(|\))+/g, char => char === '(' ? '( ': ' )');
        const description = document.getElementById('composition-description').value;
        if (!description.trim()) {
            return this.setState({ hasDescriptionError: true });
        }
        if (!this.searchIsValid(search)) {
            return this.setState({ hasCompositionError: true });
        }
        try {
            const jsonHelper = new JSONHelper;
            let compositionQuery = {};
            compositionQuery.type = "org.openmrs.module.reporting.dataset.definition.PatientDataSetDefinition";
            compositionQuery.columns = jsonHelper.addColumnsToDisplay();
            compositionQuery.customRowFilterCombination = '';
            compositionQuery.rowFilters = [];
            const searchTokens = search.split(/\s+/);
            const allHistory = JSON.parse(window.sessionStorage.getItem('openmrsHistory'));
            searchTokens.forEach(eachToken => {
                if(eachToken.match(/\d/)) {
                    // if it is an operand, then fetch the parameters of the operand from sessionStorage
                    const operandQuery = allHistory[allHistory.length - eachToken];
                    const jsonRequestObject = operandQuery.parameters;
                    jsonRequestObject.customRowFilterCombination = this.formatFilterCombination(jsonRequestObject.customRowFilterCombination,
                        compositionQuery.rowFilters.length);
                    compositionQuery.customRowFilterCombination += `(${jsonRequestObject.customRowFilterCombination})`;
                    compositionQuery.rowFilters = compositionQuery.rowFilters.concat(jsonRequestObject.rowFilters);
                } else {
                    compositionQuery.customRowFilterCombination += ` ${eachToken} `;
                }
            });
            this.performSearch({label: description, query: compositionQuery});
        } catch (error) {
            this.setState({ hasCompositionError: error ? true : false });
        }
    }

    performSearch(compositionQuery) {
        const apiHelper = new ApiHelper(null);
        apiHelper.post('reportingrest/adhocquery?v=full', compositionQuery.query).then(response => {
            response.json().then(data => {
                this.props.addToHistory(compositionQuery.label, data.rows, compositionQuery.query);
            });
        });
    }

    /**
     * Method to check for validity of the search input field.
     * @param {search} - The search String to be validated
     * @return {Boolean} - True if the search string is valid, otherwise False
     */
    searchIsValid(search) {
        return search
            .match(/and|or|not|\d+|\)|\(|union|intersection|\!|\+/gi).length ===
            search.split(/\s+/g).length;
    }

    /**
     * 
     * This function basically helps in ensuring that the number used in
     * the customRowFilterCombination in the composition query syncs with
     * the index of the rowFilter.
     * @param {string} filterText 
     * @param {int} numberOfSearches 
     */
    formatFilterCombination(filterText, numberOfSearches) {
        return filterText.replace(/\d/, theDigit => parseInt(theDigit) + numberOfSearches);
    }

    /**
     * Method to handle change events from the input fields
     * @param{event} - Event object triggered when input fields change
     * @return{undefined} - Returns undefined
     */
    handleInputChange(event) {
        event.preventDefault();
        // reset approriate error when a field value is changed
        switch(event.target.id) {
            case 'composition-search-query': {
                return this.setState({ hasCompositionError: false });
            }
            case 'composition-description': {
                return this.setState({ hasDescriptionError: false });
            }
        }
    }

    render() {
        return (
            <div id="compositions-wrapper">
                <div className="compositionsTitle">
                    <h3>Boolean Search</h3>
                </div>
                <div>
                    <p>Enter a search query and click search button below to execute:</p>
                    <i>e.g: "(1 and 2) or not 3"<br />
                        Query parameters supported are: AND, OR, NOT, UNION, INTERSECTION, !, +
                    </i>
                </div>
                <form className="form-horizontal" id="composition-form" onSubmit={this.performComposition}>
                    <div className={`form-group ${(this.state.hasCompositionError ? 'has-error' : '')}`}>
                        <label className="control-label col-sm-2" htmlFor="composition-search-query">Composition:</label>
                        <div className="col-sm-6">
                            <input id="composition-search-query" type="text" className="form-control" placeholder="Enter search query. . ." onChange={this.handleInputChange}/>
                        </div>
                        <span className="inline-label">(Required)</span>
                    </div>
                    <div className={`form-group ${(this.state.hasDescriptionError ? 'has-error' : '')}`}>
                        <label className="control-label col-sm-2" htmlFor="composition-description">Description:</label>
                        <div className="col-sm-6">
                            <input id="composition-description" type="text" className="form-control" placeholder="Enter a description" onChange={this.handleInputChange}/>
                        </div>
                        <span className="inline-label">(Required)</span>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button type="submit" className="btn btn-success">Search</button>
                            <button type="reset" className="btn btn-default cancelBtn">Reset</button>

                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

CompositionComponent.propTypes = {
    addToHistory: PropTypes.func.isRequired
};

export default CompositionComponent;
