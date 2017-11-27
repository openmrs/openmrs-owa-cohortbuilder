/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import fetchPolyfill from "whatwg-fetch";

const contextPath = location.href.split("/")[3];
const BASE_URL = `/${contextPath}/ws/rest/v1/`;

export class ApiHelper {
  constructor(requestLibrary) {
    this.ALLOWED_TYPES = ["GET", "POST", "PUT", "PATCH", "DELETE"];
    this.requestLibrary =
      requestLibrary || (window.fetch ? window.fetch : fetchPolyfill);
    this.mocked = !(requestLibrary === undefined);
    this.requestOptions = {
      credentials: "include"
    };
  }

  build(requestUrl, requestType, requestData = {}) {
    if (requestType && !this.ALLOWED_TYPES.includes(requestType)) {
      throw new Error("Invalid Request Type");
    }
    this.requestUrl = requestUrl;
    let options = {};
    if (requestType != "GET") {
      options = {
        method: requestType,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      };
    }
    this.requestOptions = Object.assign({}, this.requestOptions, options);
    return this;
  }

  send() {
    const request = this.requestLibrary;
    const response = request(
      `${BASE_URL}${this.requestUrl}`,
      this.requestOptions
    )
      .then(data => {
        return this.mocked ? data : data.json();
      })
      .catch(error => {
        return error;
      });
    return response;
  }

  get(requestUrl) {
    return this.build(requestUrl, "GET").send();
  }

  post(requestUrl, requestData) {
    return this.build(requestUrl, "POST", requestData).send();
  }

  delete(requestUrl) {
    return this.build(requestUrl, "DELETE").send();
  }
}
