/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import DownloadHelper from "../../app/js/helpers/downloadHelper";
import { expect } from "chai";
const testData = [
  {
    name: "Test User",
    age: "23",
    gender: "M"
  },
  {
    name: "Test User 2",
    age: "24",
    gender: "f"
  }
];

const testDataCSVFormat = '"Test User","23","M"\n"Test User 2","24","f"';

describe("DownloadHelper ", () => {
  it("#dowloadCSV() should throw an error if empty data is passed", () => {
    expect(() => DownloadHelper.downloadCSV([])).to.throw();
  });

  it("#dowloadCSV() should throw an error if no data is passed", () => {
    expect(() => DownloadHelper.downloadCSV()).to.throw();
  });

  it("#formatToCSV() should not throw an error if no header data is passed", () => {
    expect(DownloadHelper.formatToCSV(testData)).to.equal(testDataCSVFormat);
  });
});
