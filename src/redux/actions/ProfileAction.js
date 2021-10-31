import { createAction } from 'redux-actions';





//Get User By Id
export const GET_USER_BY_ID = "GET_USER_BY_ID"
export const getUserProfileById = createAction(GET_USER_BY_ID);

export const GET_USER_BY_ID_SUCCESS = "GET_USER_BY_ID_SUCCESS"
export const getUserProfileByIdSuccess = createAction(GET_USER_BY_ID_SUCCESS);

export const GET_USER_BY_ID_FAILED = "GET_USER_BY_ID_FAILED"
export const getUserProfileByIdFailed = createAction(GET_USER_BY_ID_FAILED);
//Get User By email
export const GET_USER_BY_EMAIL = "GET_USER_BY_EMAIL"
export const getUserProfileByEmail = createAction(GET_USER_BY_EMAIL);

export const GET_USER_BY_EMAIL_SUCCESS = "GET_USER_BY_EMAIL_SUCCESS"
export const getUserProfileByEmailSuccess = createAction(GET_USER_BY_EMAIL_SUCCESS);

export const GET_USER_BY_EMAIL_FAILED = "GET_USER_BY_EMAIL_FAILED"
export const getUserProfileByEmailFailed = createAction(GET_USER_BY_EMAIL_FAILED);
//Update User Profile
export const UPDATE_USER_PROFILE = "UPDATE_USER_PROFILE"
export const updateUserProfile = createAction(UPDATE_USER_PROFILE);

export const UPDATE_USER_PROFILE_SUCCESS = "UPDATE_USER_PROFILE_SUCCESS"
export const updateUserProfileSuccess = createAction(UPDATE_USER_PROFILE_SUCCESS);

export const UPDATE_USER_PROFILE_FAILED = "UPDATE_USER_PROFILE_FAILED"
export const updateUserProfileFailed = createAction(UPDATE_USER_PROFILE_FAILED);

//INSERT EDUCATION 
export const INSERT_EDUCATION = "INSERT_EDUCATION"
export const insertEducation = createAction(INSERT_EDUCATION);

export const INSERT_EDUCATION_SUCCESS = "INSERT_EDUCATION_SUCCESS"
export const insertEducationSuccess = createAction(INSERT_EDUCATION_SUCCESS);

export const INSERT_EDUCATION_FAILED = "INSERT_EDUCATION_FAILED"
export const insertEducationFailed = createAction(INSERT_EDUCATION_FAILED);


//INSERT Training 
export const INSERT_TRAINING = "INSERT_TRAINING"
export const insertTraining = createAction(INSERT_TRAINING);

export const INSERT_TRAINING_SUCCESS = "INSERT_TRAINING_SUCCESS"
export const insertTrainingSuccess = createAction(INSERT_TRAINING_SUCCESS);

export const INSERT_TRAINING_FAILED = "INSERT_TRAINING_FAILED"
export const insertTrainingFailed = createAction(INSERT_TRAINING_FAILED);

//INSERT Employment 
export const INSERT_EMPLOYMENT = "INSERT_EMPLOYMENT"
export const insertEmployment = createAction(INSERT_EMPLOYMENT);

export const INSERT_EMPLOYMENT_SUCCESS = "INSERT_EMPLOYMENT_SUCCESS"
export const insertEmploymentSuccess = createAction(INSERT_EMPLOYMENT_SUCCESS);

export const INSERT_EMPLOYMENT_FAILED = "INSERT_EMPLOYMENT_FAILED"
export const insertEmploymentFailed = createAction(INSERT_EMPLOYMENT_FAILED);

//Send Recommendation
export const INSERT_RECOMMENDATION = "INSERT_RECOMMENDATION"
export const insertRecommendation = createAction(INSERT_RECOMMENDATION);

export const INSERT_RECOMMENDATION_SUCCESS = "INSERT_RECOMMENDATION_SUCCESS"
export const insertRecommendationSuccess = createAction(INSERT_RECOMMENDATION_SUCCESS);

export const INSERT_RECOMMENDATION_FAILED = "INSERT_RECOMMENDATION_FAILED"
export const insertRecommendationFailed = createAction(INSERT_RECOMMENDATION_FAILED);

//Get all Employment 
export const GET_ALL_EMPLOYMENT = "GET_ALL_EMPLOYMENT"
export const getAllEmployment = createAction(GET_ALL_EMPLOYMENT);

export const GET_ALL_EMPLOYMENT_SUCCESS = "GET_ALL_EMPLOYMENT_SUCCESS"
export const getAllEmploymentSuccess = createAction(GET_ALL_EMPLOYMENT_SUCCESS);

export const GET_ALL_EMPLOYMENT_FAILED = "GET_ALL_EMPLOYMENT_FAILED"
export const getAllEmploymentFailed = createAction(GET_ALL_EMPLOYMENT_FAILED);

//Get all Education 
export const GET_ALL_EDUCATIONS = "GET_ALL_EDUCATIONS"
export const getAllEducations = createAction(GET_ALL_EDUCATIONS);

export const GET_ALL_EDUCATIONS_SUCCESS = "GET_ALL_EDUCATIONS_SUCCESS"
export const getAllEducationsSuccess = createAction(GET_ALL_EDUCATIONS_SUCCESS);

export const GET_ALL_EDUCATIONS_FAILED = "GET_ALL_EDUCATIONS_FAILED"
export const getAllEducationsFailed = createAction(GET_ALL_EDUCATIONS_FAILED);

//Document Upload

export const UPDATE_DOCUMENT_UPLOAD = "UPDATE_DOCUMENT_UPLOAD"
export const updateDocumentUpload = createAction(UPDATE_DOCUMENT_UPLOAD);

export const UPDATE_DOCUMENT_SUCCESS = "UPDATE_DOCUMENT_SUCCESS"
export const updateDocumentUploadSuccess = createAction(UPDATE_DOCUMENT_SUCCESS);

export const UPDATE_DOCUMENT_FAILED = "UPDATE_DOCUMENT_FAILED"
export const updateDocumentUploadFailed = createAction(UPDATE_DOCUMENT_FAILED);


export const UPDATE_ADRESSPROOF_UPLOAD = "UPDATE_ADRESSPROOF_UPLOAD"
export const updateAdressProof = createAction(UPDATE_ADRESSPROOF_UPLOAD);

export const UPDATE_ADRESSPROOF_UPLOAD_SUCCESS = "UPDATE_ADRESSPROOF_UPLOAD_SUCCESS"
export const updateAdressProofSuccess = createAction(UPDATE_ADRESSPROOF_UPLOAD_SUCCESS);

export const UPDATE_ADRESSPROOF_UPLOAD_FAILED = "UPDATE_ADRESSPROOF_UPLOAD_FAILED"
export const updateAdressProofFailed = createAction(UPDATE_ADRESSPROOF_UPLOAD_FAILED);

//Spiffy Icon
export const GET_SPIFFY_STRENGTH = "GET_SPIFFY_STRENGTH"
export const getSpiffyStrength = createAction(GET_SPIFFY_STRENGTH);

export const GET_SPIFFY_STRENGTH_SUCCESS = "GET_SPIFFY_STRENGTH_SUCCESS"
export const getSpiffyStrengthSuccess = createAction(GET_SPIFFY_STRENGTH_SUCCESS);

export const GET_SPIFFY_STRENGTH_FAILED = "GET_SPIFFY_STRENGTH_FAILED"
export const getSpiffyStrengthFailed = createAction(GET_SPIFFY_STRENGTH_FAILED);


//Document Verification using IDFY
export const VERIFY_PHOTO_ID = "VERIFY_PHOTO_ID"
export const verifyPhotoId = createAction(VERIFY_PHOTO_ID);

export const VERIFY_PHOTO_ID_SUCCESS = "VERIFY_PHOTO_ID_SUCCESS"
export const verifyPhotoIdSuccess = createAction(VERIFY_PHOTO_ID_SUCCESS);

export const VERIFY_PHOTO_ID_FAILED = "VERIFY_PHOTO_ID_FAILED"
export const verifyPhotoIdFailed = createAction(VERIFY_PHOTO_ID_FAILED);

export const SET_AVATAR = "SET_AVATAR"
export const setAvatar = createAction(SET_AVATAR);


//Get Profile Completion Status
export const GET_PROFILE_COMPLETION_PROGRESS = "GET_PROFILE_COMPLETION_PROGRESS"
export const getProfileCompletionProgress = createAction(GET_PROFILE_COMPLETION_PROGRESS);

export const GET_PROFILE_COMPLETION_PROGRESS_SUCCESS = "GET_PROFILE_COMPLETION_PROGRESS_SUCCESS"
export const getProfileCompletionProgressSuccess = createAction(GET_PROFILE_COMPLETION_PROGRESS_SUCCESS);

export const GET_PROFILE_COMPLETION_PROGRESS_FAILED = "GET_PROFILE_COMPLETION_PROGRESS_FAILED"
export const getProfileCompletionProgressFailed = createAction(GET_PROFILE_COMPLETION_PROGRESS_FAILED);


//Delete Employment
export const DELETE_EMPLOYMENT = "DELETE_EMPLOYMENT"
export const deleteEmployment = createAction(DELETE_EMPLOYMENT);

export const DELETE_EMPLOYMENT_SUCCESS = "DELETE_EMPLOYMENT_SUCCESS"
export const deleteEmploymentSuccess = createAction(DELETE_EMPLOYMENT_SUCCESS);

export const DELETE_EMPLOYMENT_FAILED = "DELETE_EMPLOYMENT_FAILED"
export const deleteEmploymentFailed = createAction(DELETE_EMPLOYMENT_FAILED);


//Delete Education
export const DELETE_EDUCATION = "DELETE_EDUCATION"
export const deleteEducation = createAction(DELETE_EDUCATION);

export const DELETE_EDUCATION_SUCCESS = "DELETE_EDUCATION_SUCCESS"
export const deleteEducationSuccess = createAction(DELETE_EDUCATION_SUCCESS);

export const DELETE_EDUCATION_FAILED = "DELETE_EDUCATION_FAILED"
export const deleteEducationFailed = createAction(DELETE_EDUCATION_FAILED);

//Delete Education
export const UPDATE_USER_LOCATION = "UPDATE_USER_LOCATION"
export const updateUserLocation = createAction(UPDATE_USER_LOCATION);

export const UPDATE_USER_LOCATION_SUCCESS = "UPDATE_USER_LOCATION_SUCCESS"
export const updateUserLocationSuccess = createAction(UPDATE_USER_LOCATION_SUCCESS);

export const UPDATE_USER_LOCATION_FAILED = "UPDATE_USER_LOCATION_FAILED"
export const updateUserLocationFailed = createAction(UPDATE_USER_LOCATION_FAILED);


//Send Buy Verification Email
export const BUY_VERIFICATION = "BUY_VERIFICATION"
export const buyVerification = createAction(BUY_VERIFICATION);

export const BUY_VERIFICATION_SUCCESS = "BUY_VERIFICATION_SUCCESS"
export const buyVerificationSuccess = createAction(BUY_VERIFICATION_SUCCESS);

export const BUY_VERIFICATION_FAILED = "BUY_VERIFICATION_FAILED"
export const buyVerificationFailed = createAction(BUY_VERIFICATION_FAILED);

//Send Buy Verification Email
export const REFER_PROVIDER = "REFER_PROVIDER"
export const referProvider = createAction(REFER_PROVIDER);

export const REFER_PROVIDER_SUCCESS = "REFER_PROVIDER_SUCCESS"
export const referProviderSuccess = createAction(REFER_PROVIDER_SUCCESS);

export const REFER_PROVIDER_FAILED = "REFER_PROVIDER_FAILED"
export const referProviderFailed = createAction(REFER_PROVIDER_FAILED);

export const CHANGE_LOCATION = "CHANGE_LOCATION"
export const changeLocation = createAction(CHANGE_LOCATION);

export const SET_LOCAL_PROFILE = "SET_LOCAL_PROFILE"
export const setLocalProfile = createAction(SET_LOCAL_PROFILE);

export const SET_USER_LOCATION = "SET_USER_LOCATION"
export const setUserLocation = createAction(SET_USER_LOCATION);

//Reset User Details
export const CLEAR_USER_DATA = "CLEAR_USER_DATA"
export const clearUserData = createAction(CLEAR_USER_DATA);