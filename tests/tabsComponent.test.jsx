/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import TabsComponent from '../app/js/components/tabs/tabsComponent';
import TabBarComponent from '../app/js/components/tabs/tabBarComponent';
import TabContentComponent from '../app/js/components/tabs/tabContentComponent';

import Components from '../app/js/components/tabs/tabcomponents';

// Mock Session Storage
const sessionStorageStub = () => {
  return {
    getItem: sinon.stub(),
    removeItem: sinon.stub(),
  };
};

// replace window.sessionStorage with our mock
window.sessionStorage = sessionStorageStub();

const tabs = [
  {active: true, name: 'Concept / Observation', divId: 'concept', component: Components.ConceptComponent,  },
  {active: false, name: 'Patient Attributes', divId: 'patient', component: Components.PatientComponent },
  {active: false, name: 'Encounter', divId: 'encounter', component: Components.EncounterComponent},
]

describe('<TabsComponent />', () => {

  it('should have the correct initial state', ()=>{
    const wrapper = shallow( <TabsComponent getHistory={() => ({})} addToHistory={() => ({})} /> );
    expect(wrapper.state('tabs')).to.have.length(5);
  });

  it('should load the Concept/ Observation component', ()=>{
    const wrapper = shallow( <TabsComponent getHistory={() => ({})} addToHistory={() => ({})} /> );
    expect(wrapper.state('tabs')[0].name).to.equal('Concept / Observation');
    expect(wrapper.state('tabs')[0].divId).to.equal('concept');
  });

  it('should load the Patient Attributes component', ()=>{
    const wrapper = shallow( <TabsComponent getHistory={() => ({})} addToHistory={() => ({})} /> );
    expect(wrapper.state('tabs')[1].name).to.equal('Patient Attributes');
    expect(wrapper.state('tabs')[1].divId).to.equal('patient');
  });

  it('should load the Encounter component', ()=>{
    const wrapper = shallow( <TabsComponent getHistory={() => ({})} addToHistory={() => ({})} /> );
    expect(wrapper.state('tabs')[2].name).to.equal('Encounter');
    expect(wrapper.state('tabs')[2].divId).to.equal('encounter');
  });

  it('should load the Composition component', ()=>{
    const wrapper = shallow( <TabsComponent getHistory={() => ({})} addToHistory={() => ({})} /> );
    expect(wrapper.state('tabs')[3].name).to.equal('Composition');
    expect(wrapper.state('tabs')[3].divId).to.equal('composition');
  });

  it('should load the Saved component', ()=>{
    const wrapper = shallow( <TabsComponent getHistory={() => ({})} addToHistory={() => ({})} /> );
    expect(wrapper.state('tabs')[4].name).to.equal('Saved');
    expect(wrapper.state('tabs')[4].divId).to.equal('saved');
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
