/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { expect } from "chai";
import { ApiHelper } from "../../app/js/helpers/apiHelper";
import { fakeRequestLibrary } from "./fakeRequestLibrary";

describe("Api Helper Class", () => {
  const apiHelper = new ApiHelper(fakeRequestLibrary);
  apiHelper.build("http;//google.com");

  it("should build a request", () => {
    expect(apiHelper.requestUrl).to.equal("http;//google.com");
  });

  it("should throw an error for invalid request types", () => {
    expect(
      apiHelper.build.bind(apiHelper, "http://xkcd.com", "STOP HAMMERTIME")
    ).to.throw("Invalid Request Type");
  });

  it("should add passed formData to the request object if request method is POST", () => {
    const formData = {
      userName: "johnDoe",
      email: "john@doe.com"
    };
    expect(
      apiHelper.build("http://google.com", "POST", formData).requestOptions.body
    ).to.equal(JSON.stringify(formData));
  });

  it("should make a request", () => {
    const url = "http://google.com";
    const responseUrl = "/undefined/ws/rest/v1/http://google.com";
    apiHelper
      .build(url)
      .send()
      .then(response => {
        expect(response.statusCode).to.equal(200);
        expect(response.body.message).to.equal(
          `You called /undefined/ws/rest/v1/${url}`
        );
        expect(response.url).to.equal(responseUrl);
      });
  });
});
