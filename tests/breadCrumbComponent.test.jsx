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