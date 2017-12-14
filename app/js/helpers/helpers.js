/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
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
  const modifierElement = document.querySelector("#modifier");

  const newModifier = (isNaN(modifier))
    ? modifierElement.options[modifierElement.selectedIndex].text
    : modifier;

  let modifierDescription;

  if (modifier && isNaN(modifier)) {
    modifierDescription = `= ${newModifier}`;
  } else if (modifier) {
    modifierDescription = `${operatorText} ${newModifier}`;
  } else {
    modifierDescription = '';
  }

  const onOrAfterDescription = onOrAfter ? `since ${formatDate(onOrAfter)}` : '';
  const onOrBeforeDescription = onOrBefore ? `until ${formatDate(onOrBefore)}` : '';

  return `Patients with ${timeModifier} ${conceptName} ${modifierDescription} ${onOrAfterDescription} ${onOrBeforeDescription}`.trim();
};
