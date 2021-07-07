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
import {mount, shallow} from 'enzyme';
import {expect} from 'chai';
import TabContentComponent from '../app/js/components/tabs/tabContentComponent';


import Components from '../app/js/components/tabs/tabcomponents';

describe('tabContentComponent', () => {
  let renderedComponent;
  const tabs = [
    {active: true, name: 'Concept / Observation', divId: 'concept', component: Components.ConceptComponent,  },
    {active: false, name: 'Patient Attributes', divId: 'patient', component: Components.PatientComponent },
    {active: false, name: 'Encounter', divId: 'encounter', component: Components.EncounterComponent},
    {active: false, name: 'Condition', divId: 'condition', component: Components.ConditionComponent},
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
