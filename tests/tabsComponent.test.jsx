import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import TabsComponent from '../app/js/components/tabs/tabsComponent';
import TabBarComponent from '../app/js/components/tabs/tabBarComponent';
import TabContentComponent from '../app/js/components/tabs/tabContentComponent';

import Components from '../app/js/components/tabs/tabcomponents';

const tabs = [
    {active: true, name: 'Concept / Observation', divId: 'concept', component: Components.ConceptComponent,  },
    {active: false, name: 'Patient Attributes', divId: 'patient', component: Components.PatientComponent },
    {active: false, name: 'Encounter', divId: 'encounter', component: Components.EncounterComponent},
]

describe('<TabsComponent />', () => {

    it('should mount the TabsComponent in the dom', () => {
        sinon.spy(TabsComponent.prototype, 'componentDidMount');
        const wrapper = mount(<TabsComponent getHistory={() => ({})} addToHistory={() => ({})} />);
        expect(TabsComponent.prototype.componentDidMount.calledOnce).to.equal(true);
    });

    it('should have the correct initial state', ()=>{
        const wrapper = shallow( <TabsComponent getHistory={() => ({})} addToHistory={() => ({})} /> );
        expect(wrapper.state('tabs')).to.have.length(6);
    });

    it('should set the first tab active', ()=>{
        const wrapper = shallow( <TabsComponent getHistory={() => ({})} addToHistory={() => ({})} /> );
        expect(wrapper.state('tabs')[0].active).to.equal(true);
    });

    it('should contain the right components', () => {
        const wrapper = mount( <TabsComponent getHistory={() => ({})} addToHistory={() => ({})} /> );
        wrapper.setState({tabs: tabs});
        const drawTabHeader = sinon.spy();
        const drawComponent = sinon.spy();
        expect(wrapper.find(TabBarComponent)).to.have.length(1);
        expect(wrapper.find(TabContentComponent)).to.have.length(1);
    })

    it('drawHeader function should return a tabHeader', ()=>{
        const mountComponent = TabsComponent.prototype.drawTabHeader(tabs[0],0);
        const wrapper = mount(mountComponent);
        expect(wrapper.find('.active')).to.have.length(1);
        expect(wrapper.find('.active').text()).to.equal(tabs[0].name);
    }); 
    
    
});
