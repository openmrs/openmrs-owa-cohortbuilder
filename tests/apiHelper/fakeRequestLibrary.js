/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import Response from 'http-response-object';

export const fakeRequestLibrary = (requestUrl, requestOptions, shouldPass = true, responseData = null) => {
  return new Promise((resolve, reject) => {
    if (shouldPass) {
      resolve(new Response(200, {}, { message: `You called ${requestUrl}` }, requestUrl));
    } else {
      reject(new Response(404, {}, responseData || { message: `The page at  ${requestUrl} was not found` }, requestUrl));
    }
  });
};
