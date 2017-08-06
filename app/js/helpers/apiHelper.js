import fetchPolyfill from 'whatwg-fetch';

const contextPath = location.href.split('/')[3];
const BASE_URL = `/${contextPath}/ws/rest/v1/`;

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
   * This method builds requests the user wants to make
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

  get(requestUrl) {
    return this.build(requestUrl, 'GET').send();
  }

  post(requestUrl, requestData) {
    return this.build(requestUrl, 'POST', requestData).send();
  }

  delete(requestUrl) {
    return this.build(requestUrl, 'DELETE').send();
  }
}