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