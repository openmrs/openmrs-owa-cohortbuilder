import fetchPolyfill from 'whatwg-fetch';

export class ApiHelper {
  constructor(requestLibrary) {
    this.ALLOWED_TYPES = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
    this.requestLibrary = requestLibrary || (window.fetch ? window.fetch : fetchPolyfill);
    this.mocked = !(requestLibrary === undefined);
    this.requestOptions = {
      credentials: 'include'
    };
  }

  build(requestUrl, requestType, requestData = {}, requestOptions = {}) {
    if (requestType && !this.ALLOWED_TYPES.includes(requestType)) {
      throw new Error('Invalid Request Type');
    }
    this.requestUrl = requestUrl;
    let options = {
      method: requestType,
      body: JSON.stringify(requestData)
    };
    this.requestOptions = Object.assign({}, this.requestOptions, requestOptions);
    return this;
  }

  send() {
    const response = this.requestLibrary(this.requestUrl, this.requestOptions)
      .then((data) => {
        return this.mocked ? data : data.json();
      })
      .catch((error) => {
        return error.json;
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
