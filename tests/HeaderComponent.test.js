/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

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
