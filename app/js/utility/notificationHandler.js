/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

/**
 * Handles all notifications on the system
 * @param {String} type the type of notification
 * @param {String} message the message to display
 * @returns {Function} function that displays an error message
 */
export default function handleNotification(type, message) {
  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-top-center",
    preventDuplicates: false,
    onclick: null,
    showDuration: "5000",
    hideDuration: "2000",
    timeOut: "2000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
  };

  if (type === "info") {
    toastr.info(message);
  } else if (type === "error") {
    toastr.error(message);
  } else if (type === "warning") {
    toastr.warning(message);
  } else if (type === "success") {
    toastr.success(message);
  } else {
    toastr.error("Error encountered");
  }
}
