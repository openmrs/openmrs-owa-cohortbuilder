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
import PageComponent from '../app/js/components/page/pageComponent';
import TabsComponent from '../app/js/components/tabs/tabsComponent';
import SearchHistoryTab from '../app/js/components/searchHistory/searchHistoryTab';

describe('<PageComponent />', () => {

    it('should mount the TabsComponent in itself', () => {
        const wrapper = shallow( <PageComponent/> );
        expect(wrapper.find('SearchHistoryTab')).to.have.length(1);
    });

    it('should mount the searchHistoryTab in itself', () => {
        const wrapper = shallow( <PageComponent/> );
        expect(wrapper.find('SearchHistoryTab')).to.have.length(1);
    })

    it('should mount the ActionsComponent in itself', () => {
        const wrapper = shallow( <PageComponent/> );
        expect(wrapper.find('SearchHistoryTab')).to.have.length(1);
    })
});