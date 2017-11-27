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
import ConceptComponent from '../../app/js/components/tabs/tabcomponents/conceptComponent';

describe('<ConceptComponent />', () => {
  it('should render the conceptComponent in the dom', () => {
    sinon.spy(ConceptComponent.prototype, 'render');
    const wrapper = mount(<ConceptComponent search={() => ({})} fetchData={() => ({})} addToHistory={() => ({})} />);
    expect(ConceptComponent.prototype.render.calledOnce).to.equal(true);
  });

  it('should contain the correct elements', () => {
    const wrapper = shallow(<ConceptComponent search={() => ({})} fetchData={() => ({})} addToHistory={() => ({})} />)
    wrapper.setState({ selectedConcept: {} });
    expect(wrapper.find("div")).to.have.length(2);
  });
});