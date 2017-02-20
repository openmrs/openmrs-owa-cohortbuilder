import React from 'react';
import {mount, shallow} from 'enzyme';
import {expect} from 'chai';
import ProgrammeComponent from '../../app/js/components/tabs/tabcomponents/programmeComponent';

describe('ProgrammeComponent', () => {
  let renderedComponent;
  beforeEach(() => {
    renderedComponent = shallow(<ProgrammeComponent />);
  });

  it('Should render a form', () => {
    expect(renderedComponent.find('form')).to.have.length(1);
  });

  it('Should have a search button', () => {
    const form = renderedComponent.find('form');
    expect(form.children().find('button')).to.have.length(1);
    expect(form.children().find('button').at(0).props().type).to.equal('submit');
  });

  it('should have select fields', () => {
    expect(renderedComponent.find('select')).to.have.length(9);
  });
});
