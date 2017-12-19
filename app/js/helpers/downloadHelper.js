/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import FileSaver from "file-saver";
/**
 * Helper class for downloading files on the browser
 */
class DowloadHelper {
  static downloadCSV(
    data,
    fileName,
    header = {
      c1: "Full Name",
      c2: "Age",
      c3: "Gender"
    }
  ) {
    if (!(data instanceof Array) && typeof data[0] !== "object") {
      throw new Error("Expected an Array of objects");
    }
    const toProcess = data.unshift(header);
    const csv = DowloadHelper.formatToCSV(data);
    const blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, `${fileName}.csv`);
  }

  /**
   * Formats an Array of data (objects) to CSV format
   * @param {Array} data - Array containing the data objects
   * @return {String} - CSV formated string
   */
  static formatToCSV(data) {
    const csv = data
      .map(item => {
        return Object.keys(item)
          .map(key => {
            return `"${item[key]}"`;
          })
          .join(",");
      })
      .join("\n");
    return csv;
  }
}

export default DowloadHelper;
