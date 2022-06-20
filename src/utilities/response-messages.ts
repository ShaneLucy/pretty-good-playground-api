enum ResponseMessages {
  // Authentication
  "SUCCESS" = "Success",
  "USERNAME_MALFORMED" = "Username cannot contain spaces",
  "USERNAME_EMPTY" = "Username cannot be empty",
  "USER_EXISTS" = "Username already exists",
  "USER_NOT_FOUND" = "The requested user could not be found",
  "PASSWORD_INVALID" = "Password length must be greater than 8 characters",
  "PASSWORD_EMPTY" = "Password cannot be empty",
  "INCORRECT_CREDENTIALS" = "Username or password are not correct",
  "MALFORMED_REQUEST_BODY" = "The request body was not well formed",
  "UNAUTHORISED" = "You need to login to request this resource",
  "INTERNAL_SERVER_ERROR" = "Unexpected internal server error",
  "BAD_REQUEST" = "Bad Request",
}

export default ResponseMessages;
