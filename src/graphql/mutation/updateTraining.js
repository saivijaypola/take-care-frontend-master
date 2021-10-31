
import gql from "graphql-tag";

export default gql(`
mutation updateTrainingByid($trainingId:UUID!
  $trainingPatch:TblTrainingPatch!
  ){
  updateTblTrainingByTrainingId(
    input: {trainingId:$trainingId,tblTrainingPatch:$trainingPatch}
    ){
  clientMutationId
  tblTraining {
  nodeId
  trainingId
  userId
  title
  description
  issuingAuthority
  year
  createdAt
  updatedAt
  deletedAt
  }
  }
 }
  `)

