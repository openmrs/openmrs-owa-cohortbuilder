/**
 * The contents of this file are subject to the OpenMRS Public License
 * Version 1.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 * Copyright (C) OpenMRS, LLC.  All Rights Reserved.
 */

import FileSaver from 'file-saver';

/**
 * Helper class for downloading files on the browser
 */
class DowloadHelper {
  /**
   * Method to download data (patient data) in csv format
   * 
   * @param {Array} data - An array containing objects (mostlikely patient data
   * objects)
   * @param {String} fileName - Name for the downloaded csv file
   * @param {Object} header - Object containing the keys who's values will be
   * the names of each column it the csv file. Uses default header if no header
   * is supplied.
   * @return {undefined}
   */
  static downloadCSV(data, fileName, header = {
    c1: 'Full Name', c2: "Age", c3: "Gender"
  }) {
    if (!(data instanceof Array) && typeof data[0] !== 'object') {
      throw new Error('Expected an Array of objects');
    }
    const toProcess = data.unshift(header);
    const csv = DowloadHelper.formatToCSV(data);
    const blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, `${fileName}.csv`);
  }

  /**
   * Method to format an Array of data (objects) to CSV format
   * 
   * @param {Array} data - Array containing the data objects
   * @return {String} - CSV formated string 
   */
  static formatToCSV(data) {
    const csv = data.map(item => {
      return Object.keys(item).map(key => {
        return `"${item[key]}"`;
      }).join(',');
    }).join('\n');
    return csv;
  }
}

export default DowloadHelper;
