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

import fetchPolyfill from 'whatwg-fetch';

const contextPath = location.href.split('/')[3];
const BASE_URL = `/${contextPath}/ws/rest/v1/`;

/**
 * This is the ApiHelper class
 * 
 * @export
 * @class ApiHelper
 */
export class ApiHelper {
  constructor(requestLibrary) {
    this.ALLOWED_TYPES = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
    this.requestLibrary = requestLibrary || (window.fetch ? window.fetch : fetchPolyfill);
    this.mocked = !(requestLibrary === undefined);
    this.requestOptions = {
      credentials: 'include'
    };
  }

  /**
   * This method builds requests
   * 
   * @param {String} requestUrl the request url
   * @param {String} requestType the type of the request
   * @param {Object} [requestData={}] the request data
   * @returns 
   * @memberof ApiHelper
   */
  build(requestUrl, requestType, requestData = {}) {
    if (requestType && !this.ALLOWED_TYPES.includes(requestType)) {
      throw new Error('Invalid Request Type');
    }
    this.requestUrl = requestUrl;
    let options = {};
    if (requestType != 'GET') {
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

  /**
   * This method sends the request
   * 
   * @returns 
   * @memberof ApiHelper
   */
  send() {
    const request = this.requestLibrary;
    const response = request(`${BASE_URL}${this.requestUrl}`, this.requestOptions)
      .then((data) => {
        return this.mocked ? data : data.json();
      })
      .catch((error) => {
        return error;
      });
    return response;
  }

  /**
   * This method is used to make a GET request
   * 
   * @param {String} requestUrl the request url
   * @returns 
   * @memberof ApiHelper
   */
  get(requestUrl) {
    return this.build(requestUrl, 'GET').send();
  }

  /**
   * This method is used tot make a POST request
   * 
   * @param {String} requestUrl the request url
   * @param {Object} requestData the request data
   * @returns 
   * @memberof ApiHelper
   */
  post(requestUrl, requestData) {
    return this.build(requestUrl, 'POST', requestData).send();
  }

  /**
   * This method is used to make a DELETE request
   * 
   * @param {String} requestUrl the request url
   * @returns 
   * @memberof ApiHelper
   */
  delete(requestUrl) {
    return this.build(requestUrl, 'DELETE').send();
  }
}