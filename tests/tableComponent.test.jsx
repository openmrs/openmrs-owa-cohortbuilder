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
import { shallow } from 'enzyme';
import CohortTable from '../app/js/components/common/table';

describe('<TableComponent>', () => {
  it('Should render its children', () => {
    const renderedComponent = shallow(<CohortTable />);
    expect(renderedComponent.find("div")).to.have.length(1);
    expect(renderedComponent.find("table")).to.exist;
    expect(renderedComponent.find("Navigate")).to.exist;
    expect(renderedComponent.find("Name")).to.exist;
    expect(renderedComponent.find("Description")).to.exist;
    expect(renderedComponent.find("Save")).to.exist;
    expect(renderedComponent.find("Cancel")).to.exist;
  });
});
