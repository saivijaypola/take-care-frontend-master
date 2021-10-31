import { createAction } from 'redux-actions';


//User Registration 
export const GET_ALL_DOCUMETS = "GET_ALL_DOCUMETS"
export const getAllDocuments = createAction(GET_ALL_DOCUMETS);

export const GET_ALL_DOCUMETS_SUCCESS = "GET_ALL_DOCUMETS_SUCCESS"
export const getAllDocumentsSuccess = createAction(GET_ALL_DOCUMETS_SUCCESS);

export const GET_ALL_DOCUMETS_FAILED = "GET_ALL_DOCUMETS_FAILED"
export const getAllDocumentsFailed = createAction(GET_ALL_DOCUMETS_FAILED);