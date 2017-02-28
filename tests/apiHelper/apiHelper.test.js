import { expect } from 'chai';
import { ApiHelper } from '../../app/js/helpers/apiHelper';
import { fakeRequestLibrary } from './fakeRequestLibrary';

describe('Api Helper Class', () => {
  const apiHelper = new ApiHelper(fakeRequestLibrary);
  apiHelper.build('http;//google.com');

  it('should build a request', () => {
    expect(apiHelper.requestUrl).to.equal('http;//google.com');
  });

  it('should throw an error for invalid request types', () => {
    expect(apiHelper.build.bind(apiHelper, 'http://xkcd.com', 'STOP HAMMERTIME')).to.throw('Invalid Request Type');
  });

  it('should add passed formData to the request object', () => {
    const formData = {
      userName: 'johnDoe',
      email: 'john@doe.com'
    };
    expect(apiHelper.build('http://google.com', 'GET', formData).requestOptions.body).to.equal(JSON.stringify(formData.data));
  });

  it('should add passed options to the request object', () => {
    const options = {
      data: 'this is it'
    };
    expect(apiHelper.build('http://google.com', 'GET', null, options).requestOptions.data).to.equal(options.data);
  });

  it('should make a request', () => {
    const url = 'http://google.com';
    apiHelper.build(url).send()
      .then(response => {
        expect(response.statusCode).to.equal(200);
        expect(response.body.message).to.equal(`You called ${url}`);
        expect(response.url).to.equal(url);
      });
  });


});
