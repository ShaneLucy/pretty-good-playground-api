import { ResponseMessages } from "../utilities/index";

const minPasswordLength = 8;
export const validateUsername = (username: string): ValidationResponse => {
  const response = {
    isValid: true,
    errorMessage: "",
  };

  if (username.length === 0) {
    response.isValid = false;
    response.errorMessage = ResponseMessages.USERNAME_EMPTY;
    return response;
  }

  if (/\s/.test(username)) {
    response.isValid = false;
    response.errorMessage = ResponseMessages.USERNAME_MALFORMED;
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
    response.errorMessage = ResponseMessages.PASSWORD_EMPTY;
    return response;
  }

  if (password.length < minPasswordLength) {
    response.isValid = false;
    response.errorMessage = ResponseMessages.PASSWORD_INVALID;
    return response;
  }

  return response;
};

export const validateUser = ({
  username,
  password,
}: UserAuthenticationData): ValidationResponse => {
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
