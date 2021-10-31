import { AuthAction } from '../actions/index';

const initialState = {
 
    isRegistrationSuccess: 0,
    loginUserId:'',
    errorMsg: [],
    isLoginSuccess:0,
    authLoader:false

    
};


export default function (state = initialState, action) {
    switch (action.type) {

        //User Phone Registration 

        case AuthAction.USER_REGISTRATION:
            return {
                ...state,
                isRegistrationSuccess: 0,
                authLoader:true
            }
        case AuthAction.USER_REGISTRATION_SUCCESS:
            return {
                ...state,
                isRegistrationSuccess: 1,
                loginUserId:action.payload.userId,
                authLoader:false

            }
        case AuthAction.USER_REGISTRATION_FAIL:
            return {
                ...state,
                isRegistrationSuccess: 2,
                authLoader:false,
                loginUserId:''
              
            }

             //User Login

        case AuthAction.USER_LOGIN:
            return {
                ...state,
                isLoginSuccess: 0
            }
        case AuthAction.USER_LOGIN_SUCCESS:
            return {
                ...state,
                isLoginSuccess: 1,
               

            }
        case AuthAction.USER_LOGIN_FAIL:
            return {
                ...state,
                isLoginSuccess: 2,
                loginUserId:''
              
            }

        case AuthAction.SIGNUP_CONFIRM_SUCCESS:
            return{
                ...state
            }
        default:
            return {
                ...state
            }
    }
}
