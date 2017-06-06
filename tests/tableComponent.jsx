import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import TableComponent from '../app/js/components/common/table';

describe('<TableComponent>', () => {
  it('Should render its children', () => {
    const renderedComponent = shallow(<TableComponent />);
    expect(renderedComponent.find("div")).to.have.length(1);
    expect(renderedComponent.find("table")).to.exist;
    expect(renderedComponent.find("Navigate")).to.exist;
    expect(renderedComponent.find("Name")).to.exist;
    expect(renderedComponent.find("Description")).to.exist;
    expect(renderedComponent.find("Save")).to.exist;
    expect(renderedComponent.find("Cancel")).to.exist;
  });
});
