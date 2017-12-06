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
import { fakeRequestLibrary } from '../apiHelper/fakeRequestLibrary';
import EncounterComponent from '../../app/js/components/tabs/tabcomponents/encounterComponent';

describe('<EncounterComponent /> tab component', () => {
  let encounterComponent = null;
  beforeEach(() => {
    encounterComponent = shallow(<EncounterComponent fetchData={fakeRequestLibrary} search={() => ({})} addToHistory={() => ({})} />);
  });

  it('should render 2 forms', () => {
    expect(encounterComponent.find('form')).to.have.length(2);
  });

  it('Should render a <h4> header', () => {
    expect(encounterComponent.find('h4')).to.have.length(1);
  });

  it('Search by location form should contain a search button', () => {
    expect(encounterComponent.children().find('button')).to.have.length(4);
    expect(encounterComponent.children().find('button').at(0).props().type)
      .to.equal('submit');
    expect(encounterComponent.children().find('button').at(1).props().type)
      .to.equal('reset');
  });

  it('Search by location form should have 2 select fields', () => {
    expect(encounterComponent.find('form#search-by-location select')).to.have.length(2);
  });

  it('all nodes with class control-label is a label', () => {
    expect(encounterComponent.find('.control-label').every('label')).to.be.true;
  });

});