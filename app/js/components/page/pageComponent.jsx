import React, {Component} from 'react';
import TabsComponent from '../tabs/tabsComponent';
import SearchHistoryTab from '../searchHistory/searchHistoryTab.jsx';
import ActionsComponent from '../cohorts/actionsComponent';
import './pageComponent.css';

class PageComponent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            history: []
        };
        this.addToHistory = this.addToHistory.bind(this);
        this.deleteHistory = this.deleteHistory.bind(this);
    }

    componentDidMount() {
        const currentHistory = JSON.parse(window.sessionStorage.getItem('openmrsHistory'));
        if(currentHistory) {
            this.updateStateHistory(currentHistory);
        }
    }

    /**
     * deleteHistory is used to remove a search history from the sessionStorage
     * @param {int} index 
     */
    deleteHistory(index) {
        const currentHistory = [...this.state.history];
        currentHistory.splice(index, 1);
        window.sessionStorage.setItem('openmrsHistory', JSON.stringify(currentHistory));
        this.updateStateHistory(currentHistory);
    }

    /**
     * Function is used to add to search history
     * @param {string} description - it describes the search that was performed
     * @param {object} patients - the results of the search
     * @param {object} parameters - the jsonbody that was used posted to the reportingrest/adhocquery endpoint
     */
    addToHistory(description, patients, parameters) {
        const newHistory = [{ description, patients, parameters }, ...this.state.history];
        window.sessionStorage.setItem('openmrsHistory', JSON.stringify(newHistory));
        this.updateStateHistory(newHistory);
    }

    /**
     * Function to update history property in the component state
     * @param {Array} history - new array containing history to be set in the component state
     * @return {undefined} - returns undefined
     */
    updateStateHistory(history) {
        this.setState({ history });
    }

    render(){
        return(
            <div id="body-wrapper" className="page-wrapper">
                <TabsComponent addToHistory={this.addToHistory} />
                <SearchHistoryTab history={this.state.history} deleteHistory={this.deleteHistory} />
                <ActionsComponent history={this.state.history} />
            </div>
        );
    }
}

export default PageComponent;