import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import PageComponent from '../app/js/components/pageComponent';
import TabsComponent from '../app/js/components/tabs/tabsComponent';

describe('<PageComponent />', () => {

    it('should mount the pageComponent in the dom', () => {
        sinon.spy(PageComponent.prototype, 'componentDidMount');
        const wrapper = mount(<PageComponent/>);
        expect(PageComponent.prototype.componentDidMount.calledOnce).to.equal(true);
    });

    it('should mount the TabsComponent in itself', () => {
        const wrapper = shallow( <PageComponent/> )
        expect(wrapper.contains( <TabsComponent/> )).to.equal(true);
    })
});