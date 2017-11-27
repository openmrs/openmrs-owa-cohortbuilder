/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

require("../server.babel");

const jsdom = require("jsdom").jsdom;

const exposedProperties = ["window", "navigator", "document"];

global.document = jsdom("");
global.window = document.defaultView;
Object.keys(document.defaultView).forEach(property => {
  if (typeof global[property] === "undefined") {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: "node.js"
};

process.env.NODE_ENV = "test";

function noop() {
  return null;
}

require.extensions[".css"] = noop;
require.extensions[".scss"] = noop;
require.extensions[".md"] = noop;
require.extensions[".png"] = noop;
require.extensions[".svg"] = noop;
require.extensions[".jpg"] = noop;
require.extensions[".jpeg"] = noop;
require.extensions[".gif"] = noop;

let documentRef = document;
