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
import sinon from 'sinon';
import CompositionComponent from '../../app/js/components/tabs/tabcomponents/compositionComponent';

describe('<CompositionComponent />', ()=>{
  it('should contain the correct HTML elements', ()=>{
    const wrapper = shallow(<CompositionComponent addToHistory={() => ({})} getHistory={() => ({})} />);
    expect(wrapper.find("div")).to.have.length(7);
    expect(wrapper.find("p")).to.have.length(3);
    expect(wrapper.find("form")).to.have.length(1);
    expect(wrapper.find("input")).to.have.length(2);
    expect(wrapper.find("button")).to.have.length(2);
  });
});