/**
 * takes in a date string and returns it in the format dd/mm/yy
 * @param {string} dateString date to be formatted
 * @returns {string} date in the required format
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * builds a query description based on query input 
 * @param {object} state the current state
 * @param {string} conceptName the concept name
 * @returns {string} date in the required format
 */
export const queryDescriptionBuilder = (state, conceptName) => {
  const { modifier, timeModifier, onOrAfter, onOrBefore } = state;

  const operatorSelectInput = document.querySelector("#operator1")
    ? document.querySelector("#operator1")
    : document.querySelector("#timeModifier");

  const operatorText = operatorSelectInput.options[operatorSelectInput.selectedIndex].text;

  const modifierDescription = modifier ? `${operatorText} ${modifier}` : '';
  const onOrAfterDescription = onOrAfter ? `since ${formatDate(onOrAfter)}` : '';
  const onOrBeforeDescription = onOrBefore ? `until ${formatDate(onOrBefore)}` : '';

  return `Patients with ${timeModifier} ${conceptName} ${modifierDescription} ${onOrAfterDescription} ${onOrBeforeDescription}`.trim();
};
