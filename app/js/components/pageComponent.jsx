import React, {Component} from 'react';
import BreadCrumbComponent from './breadCrumb/breadCrumbComponent';
import TabsComponent from './tabs/tabsComponent';

class PageComponent extends Component{
    componentDidMount(){}

    render(){
        return(
            <div id="body-wrapper">
                <TabsComponent />
            </div>
        );
    }
};

export default PageComponent;