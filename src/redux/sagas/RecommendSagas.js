import { takeLatest, put, call } from 'redux-saga/effects';
import { axiosGet, axiosPost } from '../../handler/apiHandler';
import { v4 as uuidv4 } from 'uuid';

import { RecommendActions } from '../actions/index'
import { mutation, query, unAuthorizedMutation, unAuthorizedQuery } from "../../graphql/graphqlHandler";
import updateInvitation from "../../graphql/mutation/updateInvitation";
import getRecommendationById from "../../graphql/query/getRecommendationById";



//User Phone Registration
function* updateInvite(action) {

    const graphqlResponse = yield call(unAuthorizedMutation, updateInvitation, action.payload);
     
    if (graphqlResponse.updateTblRecommendationByRecommendationId) {
        yield put(RecommendActions.updateInviteSuccess(graphqlResponse.updateTblRecommendationByRecommendationId.tblRecommendation))
    } else {
        yield put(RecommendActions.updateInviteFailed(graphqlResponse))
    }

}


//User Phone Registration
function* getInvitation(action) {

    const graphqlResponse = yield call(unAuthorizedQuery, getRecommendationById, action.payload);
     
    if (graphqlResponse.tblRecommendationByRecommendationId) {
        yield put(RecommendActions.getInvitationSuccess(graphqlResponse.tblRecommendationByRecommendationId))
    } else {
        yield put(RecommendActions.getInvitationFailed(graphqlResponse))
    }

}




export default function* RecommendSagas() {
    yield takeLatest(RecommendActions.UPDATE_INVITE, updateInvite);
    yield takeLatest(RecommendActions.GET_INVITATION, getInvitation);

}