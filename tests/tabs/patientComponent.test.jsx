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
import {expect} from 'chai';
import {shallow} from 'enzyme';
import PatientComponent from '../../app/js/components/tabs/tabcomponents/patientComponent';

describe('<PatientComponent /> tab component', () => {
  let theComponent = null;
  beforeEach(() => {
    theComponent = shallow(<PatientComponent addToHistory={() => ({})} search={() => ({})} fetchData={() => ({})}/>);
  });

  it('should have two forms', () => {
    expect(theComponent.find('form')).to.have.length(2);
  });

  it('should add one select option to each form', () => {
    const form1 = theComponent.find('form').at(0);
    const form2 = theComponent.find('form').at(1);
    expect(form1.children().find('select')).to.have.length(1);
    expect(form2.children().find('select')).to.have.length(1);
  });

  it('should add one submit button to each form', () => {
    const form1 = theComponent.find('form').at(0);
    const form2 = theComponent.find('form').at(1);
    expect(form1.children().find('button')).to.have.length(2);
    expect(form1.children().find('button').at(0).props().type).to.equal('submit')
    expect(form2.children().find('button')).to.have.length(2);
    expect(form2.children().find('button').at(0).props().type).to.equal('submit');
  });

  it('all nodes with class control-label is a label', () => {
    expect(theComponent.find('.control-label').every('label')).to.be.true;
  });

});