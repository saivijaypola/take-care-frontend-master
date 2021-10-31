import { DocumentsActions } from '../actions/index';

const initialState = {

    allDocuments: [],
    adressProof: [],
    photoProof: []

};


export default function (state = initialState, action) {
    switch (action.type) {

        case DocumentsActions.GET_ALL_DOCUMETS:
            return {
                ...state,
                allDocuments:[]
            }
        case DocumentsActions.GET_ALL_DOCUMETS_SUCCESS:

            return {
                ...state,
                allDocuments: action.payload,
                adressProof: action.payload.filter((doc) => doc.idType === "Adress Proof"),
                photoProof: action.payload.filter((doc) => doc.idType === "photoProof"),
            }
        case DocumentsActions.GET_ALL_DOCUMETS_FAILED:
            return {
                ...state,
                allDocuments: []
            }

        default:
            return {
                ...state
            }
    }
}
