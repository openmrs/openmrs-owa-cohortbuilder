import React from 'react';
import {mount, shallow} from 'enzyme';
import {expect} from 'chai';
import { fakeRequestLibrary } from '../apiHelper/fakeRequestLibrary';
import EncounterComponent from '../../app/js/components/tabs/tabcomponents/encounterComponent';

describe('<EncounterComponent /> tab component', () => {
  let encounterComponent = null;
  beforeEach(() => {
    encounterComponent = shallow(<EncounterComponent fetchData={fakeRequestLibrary} />);
  });

  it('should render 2 forms', () => {
    expect(encounterComponent.find('form')).to.have.length(2);
  });

  it('Should render two <h3></h3> headers for the two forms', () => {
    expect(encounterComponent.find('h3')).to.have.length(2);
  });

  it('Search by location form should contain a search button', () => {
    const locationform = encounterComponent.childAt(1).childAt(4);
    expect(locationform.children().find('button')).to.have.length(2);
    expect(locationform.children().find('button').at(0).props().type)
      .to.equal('submit');
  });

  it('Search by location form should have 2 select fields', () => {
    expect(encounterComponent.childAt(1).childAt(4).find('select')).to.have.length(2);
  });

  it('all nodes with class control-label is a label', () => {
    expect(encounterComponent.find('.control-label').every('label')).to.be.true;
  });

});