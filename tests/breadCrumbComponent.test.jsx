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
import BreadCrumbComponent from '../app/js/components/breadCrumb/breadCrumbComponent';

describe('<BreadCrumbComponent />', () => {
  it('should mount the BreadCrumbComponent in the dom', () => {
    sinon.spy(BreadCrumbComponent.prototype, 'componentDidMount');
    const wrapper = mount(<BreadCrumbComponent/>);
    expect(BreadCrumbComponent.prototype.componentDidMount.calledOnce).to.equal(true);
  });

  it('should contain the correct elements', () => {
    const wrapper = shallow(<BreadCrumbComponent/>);
    expect(wrapper.find("a")).to.have.length(1);
    expect(wrapper.find('.glyphicon')).to.have.length(2);
    expect(wrapper.find('.title').text()).to.equal('Cohort Builder');
  });
});