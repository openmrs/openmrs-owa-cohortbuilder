import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import SearchHistoryComponent from '../app/js/components/searchHistory/searchHistoryComponent';

describe('<SearchHistoryComponent />', () => {

    it('should mount the BreadCrumbComponent in the dom', () => {
        sinon.spy(SearchHistoryComponent.prototype, 'componentDidMount');
        const wrapper = mount(<SearchHistoryComponent/>);
        expect(SearchHistoryComponent.prototype.componentDidMount.calledOnce).to.equal(true);
    });

    it('should contain the correct elements', () => {
        const wrapper = shallow(<SearchHistoryComponent/>);
        expect(wrapper.find("div")).to.have.length(4);
        expect(wrapper.find("span")).to.have.length(2);
        expect(wrapper.find("label")).to.have.length(1);
        expect(wrapper.find("select")).to.have.length(1);
    });

});