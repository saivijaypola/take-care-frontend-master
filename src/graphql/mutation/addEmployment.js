
import gql from "graphql-tag";

export default gql(`
mutation($tblEmployment: TblEmploymentInput!) {
    createTblEmployment(input: { tblEmployment: $tblEmployment }) {
      clientMutationId
      tblEmployment {
        employmentId
        jobTitle
        companyName
        fromYear
        toYear
        description
      }
    }
  }
  `)