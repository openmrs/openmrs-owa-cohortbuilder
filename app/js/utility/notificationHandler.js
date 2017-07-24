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
