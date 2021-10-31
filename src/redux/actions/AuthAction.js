import { createAction } from 'redux-actions';


//User Registration 
export const USER_REGISTRATION ="USER_REGISTRATION"
export const userRegistration=createAction(USER_REGISTRATION);

export const USER_REGISTRATION_SUCCESS="USER_REGISTRATION_SUCCESS"
export const userRegistrationSuccess=createAction(USER_REGISTRATION_SUCCESS);

export const USER_REGISTRATION_FAIL="USER_REGISTRATION_FAIL"
export const userRegistrationFail=createAction(USER_REGISTRATION_FAIL);

//User Login 
export const USER_LOGIN ="USER_LOGIN"
export const userLogin=createAction(USER_LOGIN);

export const USER_LOGIN_SUCCESS="USER_LOGIN_SUCCESS"
export const userLoginSuccess=createAction(USER_LOGIN_SUCCESS);

export const USER_LOGIN_FAIL="USER_LOGIN_FAIL"
export const userLoginFail=createAction(USER_LOGIN_FAIL);

export const SIGNUP_CONFIRM ="SIGNUP_CONFIRM"
export const signupConfirm=createAction(SIGNUP_CONFIRM);

export const SIGNUP_CONFIRM_SUCCESS ="SIGNUP_CONFIRM_SUCCESS"
export const signupConfirmSuccess = createAction(SIGNUP_CONFIRM_SUCCESS);

export const AUTH_PASSWORD_RESET ="AUTH_PASSWORD_RESET"
export const resetPassword = createAction(AUTH_PASSWORD_RESET);

export const AUTH_PASSWORD_RESET_SUCCESS ="AUTH_PASSWORD_RESET_SUCCESS"
export const resetPasswordSuccess = createAction(AUTH_PASSWORD_RESET_SUCCESS);

export const AUTH_PASSWORD_RESET_FAILED ="AUTH_PASSWORD_RESET_FAILED"
export const resetPasswordFailed = createAction(AUTH_PASSWORD_RESET_FAILED);