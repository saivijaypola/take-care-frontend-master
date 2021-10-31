import { takeLatest, put, call } from 'redux-saga/effects';
import { axiosGet, axiosPost } from '../../handler/apiHandler';
import { v4 as uuidv4 } from 'uuid';

import { AuthAction, DocumentsActions } from '../actions/index'
import { mutation, query } from "../../graphql/graphqlHandler";
import getAllDocuments from '../../graphql/query/getAllDocuments';

//User Phone Registration
function* getAllDocumentsByUserId(action) {

    
    let data = { "id": action.payload.userId }
    const graphqlResponse = yield call(query, getAllDocuments, data);
     
    if (graphqlResponse.tblUserByUserId) {
        yield put(DocumentsActions.getAllDocumentsSuccess(graphqlResponse.tblUserByUserId.tblDocumentUploadsByUserId.nodes))
    } else {
        yield put(DocumentsActions.getAllDocumentsFailed(graphqlResponse))
    }

}
 

export default function* DocumentsSagas() {
    yield takeLatest(DocumentsActions.GET_ALL_DOCUMETS, getAllDocumentsByUserId);
   
}