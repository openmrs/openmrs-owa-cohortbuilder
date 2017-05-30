import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import ActionsComponent from '../app/js/components/cohorts/actionsComponent';

describe('<ActionsComponent>', () => {
  it('Should render its children', () => {
    const renderedComponent = shallow(<ActionsComponent  history={[]}/>);
    expect(renderedComponent.find("form")).to.have.length(0);
    expect(renderedComponent.find("form")).to.exist;
    expect(renderedComponent.find("Actions")).to.exist;
    expect(renderedComponent.find("Save Cohort")).to.exist;
    expect(renderedComponent.find("Name")).to.exist;
    expect(renderedComponent.find("Description")).to.exist;
    expect(renderedComponent.find("Save")).to.exist;
    expect(renderedComponent.find("Cancel")).to.exist;
  });
});
