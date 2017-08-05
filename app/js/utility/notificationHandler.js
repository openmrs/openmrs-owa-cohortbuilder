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

/**
 * This method handles all notifications on the system
 * *
 * 
 * @param {String} type the type of notification
 * @param {String} message the message to display
 * @returns {Function} function that displays an error message
 */
export default function handleNotification(type, message) {
  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "2000",
    "timeOut": "1000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };

  if (type === 'info') {
    toastr.info(message);
  } else if (type === 'error') {
    toastr.error(message);
  } else if (type === 'warning') {
    toastr.warning(message);
  } else if (type === 'success') {
    toastr.success(message);
  } else {
    toastr.error('Error encountered');
  }
}
