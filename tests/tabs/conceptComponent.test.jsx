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