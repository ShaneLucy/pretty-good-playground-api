import { LoggingMessages } from "../../logging";

type ValidationResponse = {
  isValid: boolean;
  errorMessage: string;
};

export const validateUsername = (username: string): ValidationResponse => {
  const response = {
    isValid: true,
    errorMessage: "",
  };

  if (username.length === 0) {
    response.isValid = false;
    response.errorMessage = LoggingMessages.USERNAME_EMPTY;
    return response;
  }

  if (/\s/.test(username)) {
    response.isValid = false;
    response.errorMessage = LoggingMessages.USERNAME_MALFORMED;
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
    response.errorMessage = LoggingMessages.PASSWORD_EMPTY;
    return response;
  }

  if (password.length < 8) {
    response.isValid = false;
    response.errorMessage = LoggingMessages.PASSWORD_INVALID;
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
