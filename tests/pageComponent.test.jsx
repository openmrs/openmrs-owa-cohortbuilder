import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import PageComponent from '../app/js/components/page/pageComponent';
import TabsComponent from '../app/js/components/tabs/tabsComponent';
import ActionsComponent from '../app/js/components/actionsComponent';
import SearchHistoryComponent from '../app/js/components/searchHistory/searchHistoryComponent';

describe('<PageComponent />', () => {

    it('should mount the TabsComponent in itself', () => {
        const wrapper = shallow( <PageComponent/> );
        expect(wrapper.find('TabsComponent')).to.have.length(1);
    });

    it('should mount the SearchHistoryComponent in itself', () => {
        const wrapper = shallow( <PageComponent/> );
        expect(wrapper.find('SearchHistoryComponent')).to.have.length(1);
    })

    it('should mount the ActionsComponent in itself', () => {
        const wrapper = shallow( <PageComponent/> );
        expect(wrapper.find('ActionsComponent')).to.have.length(1);
    })
});