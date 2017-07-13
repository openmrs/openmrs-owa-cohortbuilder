import React from 'react';
import {mount, shallow} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import CompositionComponent from '../../app/js/components/tabs/tabcomponents/compositionComponent';

describe('<CompositionComponent />', ()=>{
    it('should mount the compositionComponent in the dom', ()=>{
        sinon.spy(CompositionComponent.prototype, 'componentDidMount');
        const wrapper = mount(<CompositionComponent addToHistory={() => ({})} getHistory={() => ({})} />);
        expect(CompositionComponent.prototype.componentDidMount.calledOnce).to.equal(true);
    });

    it('should contain the correct HTML elements', ()=>{
        const wrapper = shallow(<CompositionComponent addToHistory={() => ({})} getHistory={() => ({})} />);
        expect(wrapper.find("div")).to.have.length(9);
        expect(wrapper.find("p")).to.have.length(1);
        expect(wrapper.find("form")).to.have.length(1);
        expect(wrapper.find("input")).to.have.length(2);
        expect(wrapper.find("button")).to.have.length(2);
    });
});