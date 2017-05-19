import React from 'react';
import {mount, shallow} from 'enzyme';
import { spy } from 'sinon';
import {expect} from 'chai';
import { fakeRequestLibrary } from '../apiHelper/fakeRequestLibrary';
import DrugComponent from '../../app/js/components/tabs/tabcomponents/drugOrderComponent';

describe('<DrugComponent />', () => {
  let drugComponent = null;
  beforeEach(() => {
    drugComponent = shallow(<DrugComponent fetchData={fakeRequestLibrary}/>);
  });

  it('should have two forms', () => {
    expect(drugComponent.find('form')).to.have.length(2);
  });

  it('both forms should have submit button', () => {
    const form1 = drugComponent.find('form').at(0);
    const form2 = drugComponent.find('form').at(1);
    expect(form1.children().find('button')).to.have.length(2);
    expect(form1.children().find('button').at(0).props().type).to.equal('submit')
    expect(form2.children().find('button')).to.have.length(2);
    expect(form2.children().find('button').at(0).props().type).to.equal('submit');
  });

  it('should have 4 multiple select fields', () => {
    const selectFields = drugComponent
      .findWhere(eachElement => eachElement.props().multiple === 'multiple');
    expect(selectFields).to.have.length(4);
  });
});