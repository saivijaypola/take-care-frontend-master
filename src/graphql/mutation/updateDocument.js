
import gql from "graphql-tag";

export default gql(`
mutation createDocument($documentInput:TblDocumentUploadInput! ){
  createTblDocumentUpload(input:{tblDocumentUpload: $documentInput} ){
    clientMutationId
    tblDocumentUpload{
      documenttype
    }
  }
}
  `)