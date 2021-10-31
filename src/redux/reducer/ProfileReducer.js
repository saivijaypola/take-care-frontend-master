import { ProfileAction } from '../actions/index';
import Profile from '../../pages/Profile';

const initialState = {

    isEducationStored: 0,
    isEmploymentStored: 0,
    allEducations: [],
    allEmployments: null,
    allDocuments: null,
    allRecommendations: null,
    allTraining: [],
    errorMsg: [],
    isProfileUpdate: 0,
    userDetails: null,
    isSentRecommendation: 0,
    recommendationResponse: null,
    isRecommendationResend: false,
    isUserLoad: 0,
    isTrainingInsert: false,
    isDocumentUploadDone: false,
    isAdressProofUploadDone: false,
    isAdressProofUpdated: false,
    isPhotoIdUpdated: false,
    isUploading: false,
    isAdressProofUploading: false,
    spiffyStrength: '',
    profileCompletionProgress: 0,
    userSpiffyData: null,
    faceMatchData: null,
    avatarUrl: '',
    isEmploymentDeleted: false,
    isEducationDeleted: false,
    userLocation: '',
    userLocationId: '',
    failedToUpdateLocation: false,
    isLoading: false,
    isBuyVerificationSent: false,
    isReferred: false,
    isProfileUpdating: false,
    selectedLocation: '',
    userLocalProfile: {},
    isUserLocationUpdated: false,
    userBasicDetails: null

};

function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const bandA = parseInt(a.fromYear);
    const bandB = parseInt(b.fromYear);

    let comparison = 0;
    if (bandB > bandA) {
        comparison = 1;
    } else if (bandB < bandA) {
        comparison = -1;
    }
    return comparison;
}

export default function (state = initialState, action) {
    switch (action.type) {
        //Get User Profile
        case ProfileAction.GET_USER_BY_ID:
            return {
                ...state,
                isUserLoad: 0,
                isEmploymentStored: 0,
                userDetails: null,
                userLocalProfile: null
            }
        case ProfileAction.GET_USER_BY_ID_SUCCESS:
            return {
                ...state,
                isUserLoad: 1,
                userDetails: action.payload,
                userLocalProfile: action.payload,
                allEmployments: action.payload.tblEmploymentsByUserId.nodes,
                allEducations: action.payload.tblEducationsByUserId.nodes,
                allTraining: action.payload.tblTrainingsByUserId.nodes,
                allRecommendations: action.payload.tblRecommendationsByUserId.nodes,
                allDocuments: action.payload.tblDocumentUploadsByUserId.nodes,
                userLocation: action.payload.tblUserLocationByUserId,
                isTrainingInsert: false,

            }
        case ProfileAction.GET_USER_BY_ID_FAILED:
            return {
                ...state,
                isUserLoad: 2
            }
        //Get User Profile
        case ProfileAction.GET_USER_BY_EMAIL:
            return {
                ...state,
                isUserLoad: 0,
                userDetails: null,
                userLocalProfile: null,
                userBasicDetails: null
            }
        case ProfileAction.GET_USER_BY_EMAIL_SUCCESS:
            return {
                ...state,
                isUserLoad: 1,
                // userDetails: action.payload,
                userBasicDetails: action.payload,
                userLocation: action.payload.tblUserLocationByUserId,
            }
        case ProfileAction.GET_USER_BY_EMAIL_FAILED:
            return {
                ...state,
                isUserLoad: 2

            }
        //Update User Profile
        case ProfileAction.UPDATE_USER_PROFILE:
            return {
                ...state,
                isProfileUpdate: 0,
                isProfileUpdating: true
            }
        case ProfileAction.UPDATE_USER_PROFILE_SUCCESS:
            return {
                ...state,
                isProfileUpdate: 1,
                isProfileUpdating: false
            }
        case ProfileAction.UPDATE_USER_PROFILE_FAILED:
            return {
                ...state,
                isProfileUpdate: 2,
                isProfileUpdating: false
            }



        //Insert Employment

        case ProfileAction.INSERT_EMPLOYMENT:
            return {
                ...state,
                isEmploymentStored: 0
            }
        case ProfileAction.INSERT_EMPLOYMENT_SUCCESS:
            var result = action.payload.response.tblEmployment

            if (action.payload.isUpdate && result) {
                var existingEmployments = [...state.allEmployments]

                var newEmployments = existingEmployments.map(function (emp) {

                    if (emp.employmentId === result.employmentId) {
                        var experience = Object.assign({}, emp);
                        experience.employmentId = result.employmentId
                        experience.jobTitle = result.jobTitle
                        experience.companyName = result.companyName
                        experience.fromYear = result.fromYear
                        experience.toYear = result.toYear
                        experience.description = result.description
                        return experience;
                    } else {
                        return emp
                    }
                })

                return {
                    ...state,
                    isEmploymentStored: 1,
                    allEmployments: [...newEmployments].sort(compare)
                }
            }
            else {
                return {
                    ...state,
                    isEmploymentStored: 1,
                    allEmployments: [result, ...state.allEmployments].sort(compare)
                }
            }

        case ProfileAction.INSERT_EMPLOYMENT_FAILED:
            return {
                ...state,
                isEmploymentStored: 2,
            }
        //Send Recom

        case ProfileAction.INSERT_RECOMMENDATION:
            return {
                ...state,
                isSentRecommendation: 0,
                recommendationResponse: null,
                isRecommendationResend: null
            }
        case ProfileAction.INSERT_RECOMMENDATION_SUCCESS:
            if (action.payload.inviteStatus === "Already Invited") {
                return {
                    ...state,
                    isSentRecommendation: 1,
                    isRecommendationResend: true,
                    recommendationResponse: action.payload,
                }
            } else {
                return {
                    ...state,
                    isSentRecommendation: 1,
                    isRecommendationResend: false,
                    recommendationResponse: action.payload,
                    allRecommendations: [action.payload.tblRecommendations, ...state.allRecommendations]
                }
            }

        case ProfileAction.INSERT_RECOMMENDATION_FAILED:
            return {
                ...state,
                isSentRecommendation: 2,
            }

        //Insert Training 
        case ProfileAction.INSERT_TRAINING:
            return {
                ...state,
                isTrainingInsert: false
            }
        case ProfileAction.INSERT_TRAINING_SUCCESS:
            return {
                ...state,
                isTrainingInsert: true,
                allTraining: [action.payload.tblTraining, ...state.allTraining]
            }
        case ProfileAction.INSERT_TRAINING_FAILED:
            return {
                ...state,
                isTrainingInsert: false
            }

        //Insert Education 
        case ProfileAction.INSERT_EDUCATION:
            return {
                ...state,
                isEducationStored: 0
            }
        case ProfileAction.INSERT_EDUCATION_SUCCESS:
            var result = action.payload.response && action.payload.response.tblEducation

            if (action.payload.isUpdate && result) {
                var existingEducations = [...state.allEducations]

                var newEducation = existingEducations.map(function (edu) {

                    if (edu.educationid === result.educationid) {
                        var education = Object.assign({}, edu);
                        education.degreeTitle = result.degreeTitle
                        education.college = result.college
                        education.fromYear = result.fromYear
                        education.toYear = result.toYear
                        return education;
                    } else {
                        return edu
                    }
                })

                return {
                    ...state,
                    isEducationStored: 1,
                    allEducations: [...newEducation].sort(compare)
                }
            } else {
                return {

                    ...state,
                    isEducationStored: 1,
                    allEducations: [result, ...state.allEducations].sort(compare)


                }
            }

        case ProfileAction.INSERT_EDUCATION_FAILED:
            return {
                ...state,
                isEducationStored: 2,
            }
        //Get Education 
        case ProfileAction.GET_ALL_EDUCATIONS:
            return {
                ...state,
                isEducationLoad: 0,

            }
        case ProfileAction.GET_ALL_EDUCATIONS_SUCCESS:
            return {
                ...state,
                isEducationLoad: 1,
                allEducations: action.payload
            }
        case ProfileAction.GET_ALL_EDUCATIONS_FAILED:
            return {
                ...state,
                isEducationLoad: 2,
            }
        //Get Employment 
        case ProfileAction.GET_ALL_EMPLOYMENT:
            return {
                ...state,
                isEmploymentLoad: 0
            }
        case ProfileAction.GET_ALL_EMPLOYMENT_SUCCESS:
            return {
                ...state,
                isEmploymentLoad: 1,
                allEmployments: action.payload
            }
        case ProfileAction.GET_ALL_EMPLOYMENT_FAILED:
            return {
                ...state,
                isEmploymentLoad: 2,
            }
        case ProfileAction.UPDATE_DOCUMENT_UPLOAD:
            return {
                ...state,
                isDocumentUploadDone: false,
                isUploading: true,
                isPhotoIdUpdated: false
            }
        case ProfileAction.UPDATE_DOCUMENT_SUCCESS:
            return {
                ...state,
                isDocumentUploadDone: true,
                isUploading: false,
                isPhotoIdUpdated: true
            }
        case ProfileAction.UPDATE_DOCUMENT_FAILED:
            return {
                ...state,
                isDocumentUploadDone: false,
                isUploading: false,
                isPhotoIdUpdated: false
            }
        case ProfileAction.UPDATE_ADRESSPROOF_UPLOAD:
            return {
                ...state,
                isAdressProofUploadDone: false,
                isAdressProofUpdated: false
            }
        case ProfileAction.UPDATE_ADRESSPROOF_UPLOAD_SUCCESS:
            return {
                ...state,
                isAdressProofUploadDone: true,
                isAdressProofUpdated: true,
                isAdressProofUploading: false
            }
        case ProfileAction.UPDATE_ADRESSPROOF_UPLOAD_FAILED:
            return {
                ...state,
                isAdressProofUploadDone: false,
                isAdressProofUpdated: false,
                isAdressProofUploading: false
            }
        case ProfileAction.GET_SPIFFY_STRENGTH:
            return {
                ...state,
                spiffyStrength: null
            }
        case ProfileAction.GET_SPIFFY_STRENGTH_SUCCESS:
            return {
                ...state,
                spiffyStrength: action.payload
            }
        case ProfileAction.GET_SPIFFY_STRENGTH_FAILED:
            return {
                ...state,
                spiffyStrength: null
            }

        case ProfileAction.GET_PROFILE_COMPLETION_PROGRESS:
            return {
                ...state,


            }
        case ProfileAction.GET_PROFILE_COMPLETION_PROGRESS_SUCCESS:
            return {
                ...state,
                profileCompletionProgress: action.payload
            }
        case ProfileAction.GET_PROFILE_COMPLETION_PROGRESS_FAILED:
            return {
                ...state,
                profileCompletionProgress: null
            }
        case ProfileAction.VERIFY_PHOTO_ID:
            return {
                ...state
            }
        case ProfileAction.VERIFY_PHOTO_ID_SUCCESS:
            return {
                faceMatchData: action.payload
            }
        case ProfileAction.VERIFY_PHOTO_ID_FAILED:
            return {
                ...state,
                faceMatchData: null
            }
        case ProfileAction.SET_AVATAR:
            return {
                ...state,
                avatarUrl: action.payload.avatarUrl
            }

        case ProfileAction.DELETE_EMPLOYMENT:
            return {
                ...state
            }
        case ProfileAction.DELETE_EMPLOYMENT_SUCCESS:
            var existingEmployments = [...state.allEmployments]
            const emp = existingEmployments.filter((emp) => emp.employmentId !== action.payload)
            return {
                ...state,
                isEmploymentDeleted: true,
                allEmployments: emp
            }

        case ProfileAction.DELETE_EMPLOYMENT_FAILED:
            return {
                ...state,
                isEmploymentDeleted: false
            }
        case ProfileAction.DELETE_EDUCATION:
            return {
                ...state
            }
        case ProfileAction.DELETE_EDUCATION_SUCCESS:
            var existingEducations = [...state.allEducations]
            const educations = existingEducations.filter((edu) => edu.educationid !== action.payload)
            return {
                ...state,
                isEducationDeleted: true,
                allEducations: educations
            }
        case ProfileAction.DELETE_EDUCATION_FAILED:
            return {
                ...state,
                isEducationDeleted: false
            }
        case ProfileAction.UPDATE_USER_LOCATION:
            return {
                ...state,
                userLocationId: '',
                isUserLocationUpdated: false
            }
        case ProfileAction.UPDATE_USER_LOCATION_SUCCESS:
            return {
                ...state,
                userLocationId: action.payload,
                failedToUpdateLocation: false,
                isUserLocationUpdated: true
            }
        case ProfileAction.UPDATE_USER_LOCATION_FAILED:
            return {
                ...state,
                userLocationId: '',
                failedToUpdateLocation: true,
                isUserLocationUpdated: false
            }
        case ProfileAction.BUY_VERIFICATION:
            return {
                ...state,
                isLoading: true
            }
        case ProfileAction.BUY_VERIFICATION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isBuyVerificationSent: true
            }
        case ProfileAction.BUY_VERIFICATION_FAILED:
            return {
                ...state,
                isLoading: false,
                isBuyVerificationSent: false
            }
        case ProfileAction.REFER_PROVIDER:
            return {
                ...state,
                isLoading: true,
                isReferred: false
            }
        case ProfileAction.REFER_PROVIDER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isReferred: false
            }
        case ProfileAction.REFER_PROVIDER_FAILED:
            return {
                ...state,
                isLoading: false,
                isReferred: false
            }
        case ProfileAction.SET_LOCAL_PROFILE:
            return {
                ...state,
                userDetails: action.payload
            }
        case ProfileAction.CHANGE_LOCATION:
            return {
                ...state,
                selectedLocation: action.payload,
            }
        case ProfileAction.SET_USER_LOCATION:
            return {
                ...state,
                userLocation: action.payload
            }
        case ProfileAction.CLEAR_USER_DATA:
            return {
                ...state,
                userLocalProfile: null,
                userBasicDetails: null,
                userDetails: null
            }
        default:
            return {
                ...state
            }
    }
}
