import React, { Component } from 'react';

import Components from './tabcomponents';
import TabBarComponent from './tabBarComponent';
import TabContentComponent from './tabContentComponent';
import { ApiHelper } from '../../helpers/apiHelper';

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
                {active: false, name: 'SQL', divId: 'sql', component: Components.SqlComponent },
                {active: false, name: 'Composition', divId: 'composition', component:  Components.CompositionComponent }
            ]
        };
    }

    componentDidMount(){}

    drawTabHeader(tab,index){
        return (
            <li key={index} className={tab.active ? 'active' : ""}><a data-toggle="tab" href={"#"+tab.divId}>{tab.name}</a></li>
        );
    }

    fetchData(url) {
        const apiHelper = new ApiHelper(null);
        const getData = new Promise(function(resolve, reject) {
            apiHelper.get(url).then(response => {
                console.log(response);
                response.json().then(data => {
                    resolve(data);
                });
            });
        });
        return getData;
        // ApiHelper.get(url);
    }

    drawComponent(tabs, fetchData) {
        return tabs.map((tab,index) => {
            return(
                <div id={tab.divId} key={index} className={'tab-pane ' + (tab.active ? 'active' : '')}>
                    <tab.component fetchData={fetchData}/>
                </div>
            );
        });
    }

    render(){
        return (
            <div className="col-sm-12 section">
                <TabBarComponent tabs={this.state.tabs} drawTabHeader={this.drawTabHeader} />
                <TabContentComponent tabs={this.state.tabs} drawComponent={this.drawComponent} fetchData={this.fetchData} />
            </div>
        )
    }

}

export default TabsComponent;