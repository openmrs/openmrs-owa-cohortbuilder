import React, {Component} from 'react';
import TabsComponent from '../tabs/tabsComponent';
import SearchHistoryComponent from '../searchHistory/searchHistoryComponent';
import ActionsComponent from '../cohorts/actionsComponent';
import './pageComponent.css';

class PageComponent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            history: []
        };
        this.addToHistory = this.addToHistory.bind(this);
    }

    componentDidMount() {
        const currentHistory = JSON.parse(window.sessionStorage.getItem('openmrsHistory'));
        if(currentHistory) {
            this.updateStateHistory(currentHistory);
        }
    }

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
                <SearchHistoryComponent history={this.state.history} />
                <ActionsComponent history={this.state.history} />
            </div>
        );
    }
}

export default PageComponent;