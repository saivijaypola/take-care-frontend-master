import { takeLatest, put, call } from 'redux-saga/effects';
import { axiosGet, axiosPost, axiosIdfyPost } from '../../handler/apiHandler';
import { v4 as uuidv4 } from 'uuid';

import { AuthAction, ProfileAction } from '../actions/index'
import { mutation, query, unAuthorizedQuery } from "../../graphql/graphqlHandler";
import addEmployment from '../../graphql/mutation/addEmployment';
import addEducation from '../../graphql/mutation/addEducation';
import getAllEducationById from '../../graphql/query/getAllEducationById';
import getAllExperienceById from '../../graphql/query/getAllExperienceById';
import deleteEmploymentById from "../../graphql/mutation/deleteEmployment";
import updateUser from '../../graphql/mutation/updateUser';
import getUserById from '../../graphql/query/getUserById';
import getUserByEmail from '../../graphql/query/getUserByEmail';
import getUserBasicDetailsById from '../../graphql/query/getUserBasicDetailsById';
import addTraining from '../../graphql/mutation/addTraining';
import updateTraining from '../../graphql/mutation/updateTraining';
import updateDocument from '../../graphql/mutation/updateDocument';
import getUserSpiffyStrength from "../../graphql/query/getUserSpiffyStrength";
import { insertTrainingSuccess } from '../actions/ProfileAction';
import updateEmploymentById from "../../graphql/mutation/updateEmployment";
import deleteEducationById from "../../graphql/mutation/deleteEducation";
import updateEducationById from "../../graphql/mutation/updateEducation";


//Get User Details by id
function* getUserProfileById(action) {
    const { userId } = action.payload;
    let data =
        { "id": userId }
    const graphqlResponse = yield call(unAuthorizedQuery, getUserById, data);

    if (graphqlResponse.tblUserByUserId) {
        yield put(ProfileAction.getUserProfileByIdSuccess(graphqlResponse.tblUserByUserId))
    } else {
        yield put(ProfileAction.getUserProfileByIdFailed(graphqlResponse))
    }
}

//Get User Spiffy
function* getUserSpiffyStrengthById(action) {
    const { userId } = action.payload;
    let data =
        { "id": userId }
    const spiffyStrengthResponse = yield call(axiosGet, `spiffy/${userId}`, {});

    if (spiffyStrengthResponse.response.data.data) {
        yield put(ProfileAction.getSpiffyStrengthSuccess(spiffyStrengthResponse.response && spiffyStrengthResponse.response.data && spiffyStrengthResponse.response.data.data && spiffyStrengthResponse.response.data.data.spiffyStrength && spiffyStrengthResponse.response.data.data.spiffyStrength))
    } else {
        yield put(ProfileAction.getSpiffyStrengthFailed())
    }
}


//Get Profile Completion Progress
function* getUserProfileCompletionProgress(action) {
    const { userId } = action.payload;
    let data =
        { "id": userId }
    const profileProgress = yield call(axiosGet, `profile/${userId}/completion`, {});

    if (profileProgress.response.data) {
        yield put(ProfileAction.getProfileCompletionProgressSuccess(profileProgress.response && profileProgress.response.data && profileProgress.response.data.data && profileProgress.response.data.data.profileCompletionStatus && profileProgress.response.data.data.profileCompletionStatus))
    } else {
        yield put(ProfileAction.getProfileCompletionProgressFailed())
    }
}


//Get User Details by email
function* getUserProfileByEmail(action) {

    const { userId } = action.payload;
    let data =
        { "userId": userId }
    const graphqlResponse = yield call(unAuthorizedQuery, getUserBasicDetailsById, data);

    if (graphqlResponse.tblUserByUserId) {
        yield put(ProfileAction.getUserProfileByEmailSuccess(graphqlResponse.tblUserByUserId))
    } else {
        yield put(ProfileAction.getUserProfileByEmailFailed(graphqlResponse))
    }
}




//Update User Profile
function* updateUserProfile(action) {

    const graphqlResponse = yield call(mutation, updateUser, action.payload);
    console.log('GRAPHQL RESPONSER', graphqlResponse)

    if (graphqlResponse.error) {
        yield put(ProfileAction.updateUserProfileFailed(null))
    }
    else if (graphqlResponse.updateTblUserByUserId) {
        yield put(ProfileAction.updateUserProfileSuccess(graphqlResponse.updateTblUserByUserId))
    } else {
        yield put(ProfileAction.updateUserProfileFailed(graphqlResponse))
    }
}
//Insert Educations
function* insertEducation(action) {

    const { degreeTitle, toYear, userId, college, fromYear, isUpdate, educationid } = action.payload;

    let data = ''
    if (!isUpdate) {
        data =
        {
            "tblEducation": {
                "educationid": uuidv4(),
                "userId": userId,
                "degreeTitle": degreeTitle,
                "fromYear": fromYear,
                "toYear": toYear,
                "college": college
            }
        }
    } else {
        data =
        {
            "educationId": educationid,
            "educationPatch": {
                "userId": userId,
                "degreeTitle": degreeTitle,
                "fromYear": fromYear,
                "toYear": toYear,
                "college": college
            }
        }
    }


    const graphqlResponse = yield call(mutation, isUpdate ? updateEducationById : addEducation, data);


    if (graphqlResponse.createTblEducation || graphqlResponse.updateTblEducationByEducationid) {
        var response = graphqlResponse.createTblEducation ? graphqlResponse.createTblEducation : graphqlResponse.updateTblEducationByEducationid
        yield put(ProfileAction.insertEducationSuccess({ isUpdate: isUpdate, response: response }))
    } else {
        yield put(ProfileAction.insertEducationFail(graphqlResponse))
    }
}

//Insert Employment
function* insertEmployment(action) {

    const { userId, job, company, fromYear, toYear, comments, isUpdate, empId } = action.payload;
    var data = ''
    if (!isUpdate) {
        data = {
            "tblEmployment": {
                "employmentId": uuidv4(),
                "userId": userId,
                "jobTitle": job,
                "companyName": company,
                "fromYear": fromYear,
                "toYear": toYear,
                "description": comments

            }

        }
    } else {
        data = {
            "employmentId": empId,
            "employment": {
                "userId": userId,
                "jobTitle": job,
                "companyName": company,
                "fromYear": fromYear,
                "toYear": toYear,
                "description": comments
            }
        }
    }

    const graphqlResponse = yield call(mutation, isUpdate ? updateEmploymentById : addEmployment, data);

    if (graphqlResponse.createTblEmployment || graphqlResponse.updateTblEmploymentByEmploymentId) {
        var response = graphqlResponse.createTblEmployment ? graphqlResponse.createTblEmployment : graphqlResponse.updateTblEmploymentByEmploymentId
        yield put(ProfileAction.insertEmploymentSuccess({ isUpdate: isUpdate, response: response }))
    } else {
        yield put(ProfileAction.insertEmploymentFailed(graphqlResponse))
    }


}

//Insert Training
function* insertTraining(action) {

    const { userId, isUpdate, trainingId, title, authority, year, description } = action.payload;
    let data = ''
    if (!isUpdate) {
        data =
        {
            "tblTraining": {
                "trainingId": uuidv4(),
                "userId": userId,
                "title": title,
                "issuingAuthority": authority,
                "description": description,
                "year": year

            }

        }
    } else {
        data =
        {
            "tblTraining": {
                "trainingId": trainingId,
                "userId": userId,
                "title": title,
                "issuingAuthority": authority,
                "description": description,
                "year": year

            }

        }
    }
    const graphqlResponse = yield call(mutation, isUpdate ? updateTraining : addTraining, data);

    if (graphqlResponse.createTblTraining || graphqlResponse.updateTblTrainingByTrainingid) {
        var response = graphqlResponse.createTblTraining ? graphqlResponse.createTblTraining : graphqlResponse.updateTblTrainingByTrainingid
        yield put(ProfileAction.insertTrainingSuccess({ isUpdate: isUpdate, response: response }))
    } else {
        yield put(ProfileAction.insertTrainingFailed(graphqlResponse))
    }


}
//Insert Recommendation
function* insertRecommendation(action) {

    const recApiResponse = yield call(axiosPost, 'recommendation/invite', action.payload);
    console.log('RECOMMENDATION API RES', recApiResponse)
    if (recApiResponse.error) {
        yield put(ProfileAction.insertRecommendationFailed())
    }
    else if (recApiResponse.response.data.data) {
        yield put(ProfileAction.insertRecommendationSuccess(recApiResponse.response.data.data))
    } else {
        yield put(ProfileAction.insertRecommendationFailed())
    }
}

//Insert Recommendation
function* updateUserLocation(action) {

    const recApiResponse = yield call(axiosPost, 'user/location', action.payload);
    console.log('AXIOS RESPONSE', recApiResponse)
    if (recApiResponse.error) {
        yield put(ProfileAction.updateUserLocationFailed())
    }
    else if (recApiResponse.response.data.returnMessage !== null) {
        yield put(ProfileAction.updateUserLocationSuccess(recApiResponse.response))
    } else {
        yield put(ProfileAction.updateUserLocationFailed())
    }
}

//Post Buy Verification
function* buyVerification(action) {

    const recApiResponse = yield call(axiosPost, 'verification/buy', action.payload);
    if (recApiResponse.response && recApiResponse.response.data) {
        yield put(ProfileAction.buyVerificationSuccess(recApiResponse.response.data))
    } else {
        yield put(ProfileAction.buyVerificationFailed())
    }
}

//Post Refer a friend
function* referProvider(action) {

    const recApiResponse = yield call(axiosPost, 'provider/refer', action.payload);
    if (recApiResponse.response && recApiResponse.response.data) {
        yield put(ProfileAction.referProviderSuccess(recApiResponse.response.data))
    } else {
        yield put(ProfileAction.referProviderFailed())
    }
}


//Document Verification Entry
function* updateDocumentUpload(action) {

    const graphqlResponse = yield call(mutation, updateDocument, action.payload);
    if (graphqlResponse.data) {
        yield put(ProfileAction.updateDocumentUploadSuccess())
    } else {
        yield put(ProfileAction.updateDocumentUploadFailed())
    }

}

//Adress Proof Verification Entry
function* updateAdressProofEntry(action) {

    const graphqlResponse = yield call(mutation, updateDocument, action.payload);
    if (graphqlResponse.createTblDocumentUpload) {
        yield put(ProfileAction.updateAdressProofSuccess())
    } else {
        yield put(ProfileAction.updateAdressProofFailed())
    }

}

function* deleteEmployment(action) {

    const graphqlResponse = yield call(mutation, deleteEmploymentById, action.payload);

    if (graphqlResponse.deleteTblEmploymentByEmploymentId) {

        yield put(ProfileAction.deleteEmploymentSuccess(graphqlResponse.deleteTblEmploymentByEmploymentId.tblEmployment.employmentId))
    } else {
        yield put(ProfileAction.deleteEmploymentFailed())
    }

}


function* deleteEducation(action) {

    const graphqlResponse = yield call(mutation, deleteEducationById, action.payload);

    if (graphqlResponse.deleteTblEducationByEducationid) {

        yield put(ProfileAction.deleteEducationSuccess(graphqlResponse.deleteTblEducationByEducationid.tblEducation.educationid))
    } else {
        yield put(ProfileAction.deleteEducationFailed())
    }

}

//Document Verification Using IDFy
function* verifyFaceMatch(action) {

    const faceMatchResponse = yield call(axiosIdfyPost, 'tasks/sync/compare/face/', action.payload);

    if (faceMatchResponse.response.data.data) {
        yield put(ProfileAction.verifyPhotoIdSuccess(faceMatchResponse.response.data.data))
    } else {
        yield put(ProfileAction.verifyPhotoIdFailed())
    }
}

export default function* ProfileSagas() {

    yield takeLatest(ProfileAction.GET_USER_BY_ID, getUserProfileById);
    yield takeLatest(ProfileAction.GET_USER_BY_EMAIL, getUserProfileByEmail);
    yield takeLatest(ProfileAction.UPDATE_USER_PROFILE, updateUserProfile);
    yield takeLatest(ProfileAction.INSERT_EDUCATION, insertEducation);
    yield takeLatest(ProfileAction.INSERT_EMPLOYMENT, insertEmployment);
    yield takeLatest(ProfileAction.INSERT_TRAINING, insertTraining);
    yield takeLatest(ProfileAction.INSERT_RECOMMENDATION, insertRecommendation);
    yield takeLatest(ProfileAction.UPDATE_DOCUMENT_UPLOAD, updateDocumentUpload);
    yield takeLatest(ProfileAction.UPDATE_ADRESSPROOF_UPLOAD, updateAdressProofEntry);
    yield takeLatest(ProfileAction.GET_SPIFFY_STRENGTH, getUserSpiffyStrengthById);
    yield takeLatest(ProfileAction.VERIFY_PHOTO_ID, verifyFaceMatch);
    yield takeLatest(ProfileAction.GET_PROFILE_COMPLETION_PROGRESS, getUserProfileCompletionProgress);
    yield takeLatest(ProfileAction.DELETE_EMPLOYMENT, deleteEmployment);
    yield takeLatest(ProfileAction.DELETE_EDUCATION, deleteEducation);
    yield takeLatest(ProfileAction.UPDATE_USER_LOCATION, updateUserLocation);
    yield takeLatest(ProfileAction.BUY_VERIFICATION, buyVerification);
    yield takeLatest(ProfileAction.REFER_PROVIDER, referProvider);


}