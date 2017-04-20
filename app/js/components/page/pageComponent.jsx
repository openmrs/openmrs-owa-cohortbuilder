import React, {Component} from 'react';
import TabsComponent from '../tabs/tabsComponent';
import SearchHistoryComponent from '../searchHistory/searchHistoryComponent';
import ActionsComponent from '../actionsComponent';
import './pageComponent.css';

class PageComponent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            history: []
        }
        this.addToHistory = this.addToHistory.bind(this);
    }

    componentDidMount() {
        const currentHistory = JSON.parse(window.sessionStorage.getItem('openmrsHistory')).reverse();
        if(currentHistory) {
            this.setState({history: currentHistory});
        }
    }

    addToHistory(description, total, parameters) {
        const newHistory = [...this.state.history, {description, total, parameters}];
        window.sessionStorage.setItem('openmrsHistory', JSON.stringify(newHistory));
        this.setState({history: newHistory.reverse()});
    }

    render(){
        return(
            <div id="body-wrapper" className="page-wrapper">
                <TabsComponent addToHistory={this.addToHistory} />
                <SearchHistoryComponent history={this.state.history} />
                <ActionsComponent />
            </div>
        );
    }
}

export default PageComponent;