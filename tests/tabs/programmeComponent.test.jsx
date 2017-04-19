import React from 'react';
import {mount, shallow} from 'enzyme';
import {expect} from 'chai';
import ProgrammeComponent from '../../app/js/components/tabs/tabcomponents/programmeComponent';

describe('ProgrammeComponent', () => {
  let renderedComponent;
  beforeEach(() => {
    renderedComponent = shallow(<ProgrammeComponent />);
  });

  it('Should render 2 forms', () => {
    expect(renderedComponent.find('form')).to.have.length(2);
  });

  it('Should render two h3 headers for the two forms', () => {
    expect(renderedComponent.find('h3')).to.have.length(2);
  });

  it('Search by location form should contain a search button', () => {
    const locationform = renderedComponent.childAt(1);
    expect(locationform.children().find('button')).to.have.length(1);
    expect(locationform.children().find('button').at(0).props().type)
      .to.equal('submit');
  });

  it(`Search by programme enrollment and status form should contatin a search
    button`, () => {
    const locationform = renderedComponent.childAt(3);
    expect(locationform.children().find('button')).to.have.length(1);
    expect(locationform.children().find('button').at(0).props().type)
      .to.equal('submit');
  });

  it(`Search by programme enrollment and status form should have 2 select
    fields`, () => {
    expect(renderedComponent.childAt(3).find('select')).to.have.length(2);
  });

  it('Search by location form should form should have 3 select fields', () => {
    expect(renderedComponent.childAt(1).find('select')).to.have.length(3);
  });
});
