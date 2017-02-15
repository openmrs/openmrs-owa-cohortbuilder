import React from 'react';
import {mount, shallow} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import ConceptComponent from '../../app/js/components/tabs/tabcomponents/conceptComponent';

describe('<ConceptComponent />', ()=>{
    it('should mount the conceptComponent in the dom', ()=>{
        sinon.spy(ConceptComponent.prototype, 'componentDidMount');
        const wrapper = mount(<ConceptComponent />);
        expect(ConceptComponent.prototype.componentDidMount.calledOnce).to.equal(true);
    });

    it('should contain the correct elements', ()=>{
        const wrapper = shallow(<ConceptComponent />);
        expect(wrapper.find("div")).to.have.length(1);
        expect(wrapper.find("label")).to.have.length(2);
        expect(wrapper.find("input")).to.have.length(2);
    });
});