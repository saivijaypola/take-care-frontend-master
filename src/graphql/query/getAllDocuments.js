import gql from "graphql-tag";
export default gql(`
query($id:String!,$idType:String){
  tblUserByUserId(userId: $id){
    nodeId
    userId
    tblDocumentUploadsByUserId(condition:{idType:$idType}){
      nodes{
        documenttype
        isVerified
        idType
      }
    }
  }
}
  `);
