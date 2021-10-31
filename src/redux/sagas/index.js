import { fork, all } from 'redux-saga/effects';

import AuthSagas from './AuthSagas';
import ProfileSagas from './ProfileSagas';
import DocumentsSagas from "./DocumentsSagas";
import RecommendSagas from "./RecommendSagas";
import RequestSagas from "./RequestSagas";
import UserSagas from "./UserSagas";
import AdminSagas from "./AdminSagas";
export default function* sagas() {
    yield all([fork(AuthSagas)]);
    yield all([fork(ProfileSagas)]);
    yield all([fork(DocumentsSagas)]);
    yield all([fork(RecommendSagas)]);
    yield all([fork(RequestSagas)]);
    yield all([fork(UserSagas)]);
    yield all([fork(AdminSagas)]);
}