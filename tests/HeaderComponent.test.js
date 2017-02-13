import React from 'react';
import { expect } from 'chai';
import {mount, shallow} from 'enzyme';
import {Header, dropDownMenu} from '../app/js/components/common/Header';


describe('<Header />', () => {
    it('Should render its children', () => {
      const renderedComponent = shallow(<Header />);
      expect(renderedComponent.find("Link")).to.have.length(3);
    });

    it('Ensures the dropDownMenu populates the dropdown menu', ()=>{
      const component = dropDownMenu();
      expect(component).to.have.length(3);
      expect(component[0].type).to.equal('li');
      const childComponent = component[0].props.children;
      expect(childComponent[0].type).to.equal('a');
      expect(childComponent[0].props.children).to.equal('Inpatient ward');

    });
});
