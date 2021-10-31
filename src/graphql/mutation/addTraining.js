
import gql from "graphql-tag";

export default gql(`
mutation($tblTraining:TblTrainingInput!){
    createTblTraining(input:{tblTraining:$tblTraining}){
      clientMutationId
      tblTraining
      {
        trainingId
        userId
        title
        issuingAuthority
        description
        year
      }
    }
  }
  `)