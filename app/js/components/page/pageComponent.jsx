import React, {Component} from 'react';
import TabsComponent from '../tabs/tabsComponent';
import SearchHistoryComponent from '../searchHistory/searchHistoryComponent';
import ActionsComponent from '../actionsComponent';
import './pageComponent.css';

class PageComponent extends Component{
    componentDidMount(){}

    render(){
        return(
            <div id="body-wrapper" className="page-wrapper">
                <TabsComponent />
                <SearchHistoryComponent />
                <ActionsComponent />
            </div>
        );
    }
}

export default PageComponent;