import { takeLatest, put, call } from 'redux-saga/effects';
import { axiosGet, axiosPost } from '../../handler/apiHandler';
import { v4 as uuidv4 } from 'uuid';

import { AuthAction } from '../actions/index'
import { mutation, query, unAuthorizedQuery,unAuthorizedMutation } from "../../graphql/graphqlHandler";
import getAllUsers from '../../graphql/query/getAllUsers';
import addUser from '../../graphql/mutation/addUser';
import loginAuthentication from '../../graphql/query/loginAuthentication';
import { graphql } from 'graphql';

//User Phone Registration
function* userRegistration(action) {

    const { fullName, email, role, avatar, password, uid } = action.payload;
    let data =
    {
        "tblUser": {
            "userId": uid,
            "username": email.toString().toLowerCase().trim(),
            "email": email.toString().toLowerCase().trim(),
            "role": role,
            "fullname": fullName.toString().trim(),
            "avatarUrl": avatar,
            "password": password,
            "createdAt": new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"})

        }

    }
    localStorage.setItem('role',role)
    const graphqlResponse = yield call(unAuthorizedMutation, addUser, data);
     
    if (graphqlResponse.createTblUser) {

        yield put(AuthAction.userRegistrationSuccess(graphqlResponse.createTblUser.tblUser))

    } else {
        yield put(AuthAction.userRegistrationFail(graphqlResponse))
    }


}

//User Phone Registration
function* userLogin(action) {
    const { username, password } = action.payload;
    let data =
    {
        "username": username,
        "pwd": password
    }
    const graphqlResponse = yield call(query, loginAuthentication, data);

    if (graphqlResponse.allTblUsers) {
        if (graphqlResponse.allTblUsers.totalCount > 0) {

            yield put(AuthAction.userLoginSuccess(graphqlResponse.allTblUsers.nodes[0]))
        } else {
            yield put(AuthAction.userLoginFail(graphqlResponse))
        }

    } else {

    }


}


//Confirm Signuo
function* signupConfirm(action) {

    const apiResponse = yield call(axiosPost, 'signup/confirm', action.payload);
    yield put(AuthAction.signupConfirmSuccess(apiResponse))
}


export default function* AuthSagas() {

    yield takeLatest(AuthAction.USER_REGISTRATION, userRegistration);
    yield takeLatest(AuthAction.USER_LOGIN, userLogin);
    yield takeLatest(AuthAction.SIGNUP_CONFIRM, signupConfirm);

}