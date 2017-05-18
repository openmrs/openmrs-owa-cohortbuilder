import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import PageComponent from '../app/js/components/page/pageComponent';
import TabsComponent from '../app/js/components/tabs/tabsComponent';
import ActionsComponent from '../app/js/components/cohorts/actionsComponent';
import SearchHistoryTab from '../app/js/components/searchHistory/searchHistoryTab';

describe('<PageComponent />', () => {

    it('should mount the TabsComponent in itself', () => {
        const wrapper = shallow( <PageComponent/> );
        expect(wrapper.find('TabsComponent')).to.have.length(1);
    });

    it('should mount the searchHistoryTab in itself', () => {
        const wrapper = shallow( <PageComponent/> );
        expect(wrapper.find('SearchHistoryTab')).to.have.length(1);
    })

    it('should mount the ActionsComponent in itself', () => {
        const wrapper = shallow( <PageComponent/> );
        expect(wrapper.find('ActionsComponent')).to.have.length(1);
    })
});