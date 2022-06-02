enum LoggingMessages {
  // Authentication
  "SUCCESS" = "Success",
  "USERNAME_MALFORMED" = "Username cannot contain spaces",
  "USERNAME_EMPTY" = "Username cannot be empty",
  "USER_EXISTS" = "Username already exists",
  "USER_NOT_FOUND" = "The requested user could not be found",
  "PASSWORD_INVALID" = "Password length must be greater than 8 characters",
  "PASSWORD_EMPTY" = "Password cannot be empty",
  "INCORRECT_CREDENTIALS" = "Username or password are not correct",
}

export default LoggingMessages;
