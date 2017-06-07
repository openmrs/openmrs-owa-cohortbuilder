import React, { Component,PropTypes } from 'react';

import Components from './tabcomponents';
import TabBarComponent from './tabBarComponent';
import TabContentComponent from './tabContentComponent';
import { ApiHelper } from '../../helpers/apiHelper';
import { JSONHelper } from '../../helpers/jsonHelper';

import './tabs.css';

class TabsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [
                {active: true, name: 'Concept / Observation', divId: 'concept', component: Components.ConceptComponent },
                {active: false, name: 'Patient Attributes', divId: 'patient', component: Components.PatientComponent },
                {active: false, name: 'Encounter', divId: 'encounter', component: Components.EncounterComponent},
                {active: false, name: 'Programmme Enrollment', divId: 'programme', component: Components.ProgrammeComponent},
                {active: false, name: 'Drug Order', divId: 'drug', component: Components.DrugOrderComponent },
                {active: false, name: 'Composition', divId: 'composition', component:  Components.CompositionComponent },
                {active: false, name: 'Saved', divId: 'saved', component:  Components.SavedComponent }
            ]
        };
        this.search  = this.search.bind(this);
    }

    componentDidMount(){}

    drawTabHeader(tab,index){
        return (
            <li key={index} className={tab.active ? 'active' : ""}><a data-toggle="tab" href={"#"+tab.divId}>{tab.name}</a></li>
        );
    }


    search(queryDetails, description = "") {
        const apiHelper = new ApiHelper(null);
        const { getHistory } = this.props;
        const searchResult = new Promise(function(resolve, reject) {
            apiHelper.post('reportingrest/adhocquery?v=full', queryDetails.query).then(response => {
                response.json().then(data => {
                    data.searchDescription = description || queryDetails.label;
                    data.query = queryDetails.query;
                    getHistory(data, data.searchDescription);
                    resolve(data);
                });
            });
        });
        return searchResult;
    }

    fetchData(url) {
        const apiHelper = new ApiHelper(null);
        const getData = new Promise(function(resolve, reject) {
            apiHelper.get(url).then(response => {
                response.json().then(data => {
                    resolve(data);
                });
            });
        });
        return getData;
    }

    drawComponent(tabs, fetchData, search, addToHistory, getHistory) {
        return tabs.map((tab,index) => {
            return(
                <div id={tab.divId} key={index} className={'tab-pane ' + (tab.active ? 'active' : '')}>
                    <tab.component fetchData={fetchData} search={search} addToHistory={addToHistory} getHistory={getHistory} />
                </div>
            );
        });
    }

    render(){
        const { getHistory } = this.props; 
    
        return (
            <div className="col-sm-12 section">
                <TabBarComponent tabs={this.state.tabs} drawTabHeader={this.drawTabHeader} />
                <TabContentComponent
                    tabs={this.state.tabs}
                    search={this.search}
                    drawComponent={this.drawComponent}
                    fetchData={this.fetchData}
                    addToHistory={this.props.addToHistory}
                    getHistory={getHistory}
                />
            </div>
        );
    }

}

TabsComponent.propTypes = {
    getHistory : PropTypes.func,
    addToHistory: PropTypes.func,
};
export default TabsComponent;