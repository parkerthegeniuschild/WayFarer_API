export default {
  checkForEmptyFields: (field, value) => {
    if (!value) return [`${field} is required`];
    return [];
  },

  checkPatternedFields: (field, value, regex) => {
    if (!regex.test(value)) return [`${field} is invalid`];
    return [];
  },
};
