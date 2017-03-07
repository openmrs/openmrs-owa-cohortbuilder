import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { Header } from '../app/js/components/common/Header';


describe('<Header />', () => {
    const renderedComponent = shallow( < Header / > );
    it('Should render its children', () => {
        expect(renderedComponent.find("Link")).to.have.length(3);
    });

    it('Ensures the dropDownMenu populates the fetch locations', () => {
        expect(renderedComponent.find("Amani Hospital")).to.exist;
        expect(renderedComponent.find("Registration Desk")).to.exist;
        expect(renderedComponent.find("Outpatient Clinic")).to.exist;
        expect(renderedComponent.find("Unknown Location")).to.exist;
    });
});
