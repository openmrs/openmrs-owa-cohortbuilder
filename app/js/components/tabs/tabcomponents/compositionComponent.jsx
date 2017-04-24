import React, { Component, PropTypes } from 'react';
import { ApiHelper } from '../../../helpers/apiHelper';
import { JSONHelper } from '../../../helpers/jsonHelper';

class CompositionComponent extends Component {
    constructor(props) {
        super();
        this.performComposition = this.performComposition.bind(this);
    }

    componentDidMount() {/* important for test*/ }

    
    /**
     * The function takes the input of the text field and makes a search
     * @param {object} event 
     */
    performComposition(event) {
        event.preventDefault();
        const search = document.getElementById('composition-search-query').value;
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
        this.performSearch({label: search, query: compositionQuery});
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

    render() {
        return (
            <div id="compositions-wrapper">
                <div className="compositionsTitle">
                    <h3>Boolean Search</h3>
                </div>
                <p>Enter a search query and click search button below to execute:</p>
                <i>e.g: "(1 and 2) or not"<br />
                    Query parameters supported are: AND, OR, NOT, UNION, INTERSECTION, !, +
                </i> <br />
                <form className="form-horizontal col-md" onSubmit={this.performComposition}>
                    <div className="form-group">
                        <div className="col-sm-12">
                            <input id="composition-search-query" type="text" className="form-control" placeholder="Enter search query. . ." />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm col-sm-10">
                            <button type="submit" className="btn btn-success">Search</button>
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
