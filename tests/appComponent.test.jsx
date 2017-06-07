import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import App from '../app/js/components/App';
import { Header } from '../app/js/components/common/Header';
import PageComponent from '../app/js/components/page/pageComponent';
import BreadCrumbComponent from '../app/js/components/breadCrumb/breadCrumbComponent';

describe('<App />', () => {

    it('should mount the BreadCrumbComponent in itself', () => {
        const wrapper = shallow( <App/> )
        expect(wrapper.contains( <BreadCrumbComponent/> )).to.equal(true);
    });

    it('should mount the PageComponent in itself', () => {
        const wrapper = shallow( <App/> )
        expect(wrapper.find('PageComponent')).to.have.length(1)
    });

    it('should mount the Header in itself', () => {
        const wrapper = shallow( <App/> )
        expect(wrapper.contains( <Header/> )).to.equal(true);
    });

});