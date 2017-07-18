import React from 'react';
import {mount, shallow} from 'enzyme';
import {expect} from 'chai';
import TabContentComponent from '../app/js/components/tabs/tabContentComponent';


import Components from '../app/js/components/tabs/tabcomponents';

describe('ProgrammeComponent', () => {
  let renderedComponent;
  const tabs = [
    {active: true, name: 'Concept / Observation', divId: 'concept', component: Components.ConceptComponent,  },
    {active: false, name: 'Patient Attributes', divId: 'patient', component: Components.PatientComponent },
    {active: false, name: 'Encounter', divId: 'encounter', component: Components.EncounterComponent},
]
  beforeEach(() => {
    renderedComponent = shallow(<TabContentComponent tabs={tabs} fetchData={() => ({})} search={() => ({})} addToHistory={() => ({})} getHistory={() => ({})} />);
  });

  it('drawComponent function should return a tabContentComponent', ()=>{
    const mountComponent = TabContentComponent.prototype.drawComponent(tabs, () => ({}), () => ({}), () => ({}), () => ({}),)[0];
    const wrapper = mount(mountComponent);
    expect(wrapper.find('.tab-pane')).to.have.length(1);
  });
})
