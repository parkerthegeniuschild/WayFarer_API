/**
 * Must be a valid email address
 * @type {RegExp}
 */
export const emailRegex = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{3})+$/;

/**
 * Password must be at least 6 characters, no more than 12 characters, and must include at least
 * one upper case letter, one lower case letter, and one numeric digit.
 * @type {RegExp}
 */
export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;
