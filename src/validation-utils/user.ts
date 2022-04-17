type ValidationResponse = {
  isValid: boolean;
  errorMessage: string;
};

export const usernameEmptyErrorMessage = "Username cannot be empty";
export const usernameInvalidCharactersErrorMessage = "Username cannot contain spaces";
export const passwordEmptyErrorMessage = "Password cannot be empty";
export const passwordInvalidErrorMessage = "Password must be greater than 8 characters";

export const validateUsername = (username: string): ValidationResponse => {
  const response = {
    isValid: true,
    errorMessage: "",
  };

  if (username.length === 0) {
    response.isValid = false;
    response.errorMessage = usernameEmptyErrorMessage;
    return response;
  }

  if (/\s/.test(username)) {
    response.isValid = false;
    response.errorMessage = usernameInvalidCharactersErrorMessage;
    return response;
  }
  return response;
};

export const validatePassword = (password: string): ValidationResponse => {
  const response = {
    isValid: true,
    errorMessage: "",
  };

  if (password.length === 0) {
    response.isValid = false;
    response.errorMessage = passwordEmptyErrorMessage;
    return response;
  }

  if (password.length < 8) {
    response.isValid = false;
    response.errorMessage = passwordInvalidErrorMessage;
    return response;
  }

  return response;
};

export const validateUser = (username: string, password: string): ValidationResponse => {
  const usernameResponse = validateUsername(username);
  if (!usernameResponse.isValid) {
    return usernameResponse;
  }

  const passwordResponse = validatePassword(password);
  if (!passwordResponse.isValid) {
    return passwordResponse;
  }

  return {
    isValid: true,
    errorMessage: "",
  };
};
