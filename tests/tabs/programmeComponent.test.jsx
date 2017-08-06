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
import ProgrammeComponent from '../../app/js/components/tabs/tabcomponents/programmeComponent';

describe('ProgrammeComponent', () => {
  let renderedComponent;
  beforeEach(() => {
    renderedComponent = shallow(<ProgrammeComponent fetchData={() => ({})} search={() => ({})} addToHistory={() => ({})} getHistory={() => ({})} />);
  });

  it('Should render 1 forms', () => {
    expect(renderedComponent.find('form')).to.have.length(1);
  });

  it('Should render 1 h3 headers for the form', () => {
    expect(renderedComponent.find('h3')).to.have.length(1);
  });

  it(`Search by programme enrollment and status form should contatin a search
    button`, () => {
    const locationform = renderedComponent.childAt(1);
    expect(locationform.children().find('button')).to.have.length(2);
    expect(locationform.children().find('button').at(0).props().type)
      .to.equal('submit');
  });

  it(`Search by programme enrollment and status form should have 3 select
    fields`, () => {
    expect(renderedComponent.childAt(1).find('select')).to.have.length(3);
  });

  it('Search by location form should form should have 3 select fields', () => {
    expect(renderedComponent.childAt(1).find('select')).to.have.length(3);
  });
});
