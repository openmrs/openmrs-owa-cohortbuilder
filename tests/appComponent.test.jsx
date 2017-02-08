import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import AppComponent from '../app/js/components/App';
import PageComponent from '../app/js/components/pageComponent';
import BreadCrumbComponent from '../app/js/components/breadCrumb/breadCrumbComponent';

describe('<AppComponent />', () => {

    it('should mount the AppComponent in the dom', () => {
        sinon.spy(AppComponent.prototype, 'componentDidMount');
        const wrapper = mount(<AppComponent/>);
        expect(AppComponent.prototype.componentDidMount.calledOnce).to.equal(true);
    });

    it('should mount the BreadCrumbComponent in itself', () => {
        const wrapper = shallow( <AppComponent/> )
        expect(wrapper.contains( <BreadCrumbComponent/> )).to.equal(true);
    });

    it('should mount the PageComponent in itself', () => {
        const wrapper = shallow( <AppComponent/> )
        expect(wrapper.contains( <PageComponent/> )).to.equal(true);
    });

});