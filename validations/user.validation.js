module.exports.signUpValidation = function (data) {
  const { email, password, name, contact, address, gender, country } = data;
  if (
    !email ||
    !password ||
    !name ||
    !contact ||
    !address ||
    !gender ||
    !country
  ) {
    return false;
  }
  return true;
};
