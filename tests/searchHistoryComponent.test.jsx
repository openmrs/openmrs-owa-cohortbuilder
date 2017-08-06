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
import SearchHistoryComponent from '../app/js/components/searchHistory/searchHistoryComponent';

describe('<SearchHistoryComponent />', () => {

    it('should render the BreadCrumbComponent in the dom', () => {
        sinon.spy(SearchHistoryComponent.prototype, 'render');
        const wrapper = mount(<SearchHistoryComponent history={[]} deleteHistory={() => ({})} loading={false} />);
        expect(SearchHistoryComponent.prototype.render.calledOnce).to.equal(true);
    });

    it('should contain the correct elements', () => {
        const wrapper = shallow(<SearchHistoryComponent history={[]} deleteHistory={() => ({})} loading={false} />);
        expect(wrapper.find("div")).to.have.length(3);
        expect(wrapper.find("h3")).to.have.length(1);
    });

});