
import gql from "graphql-tag";

export default gql(`
mutation($tblEducation: TblEducationInput!) {
    createTblEducation(input: { tblEducation: $tblEducation }) {
      clientMutationId
      tblEducation {
        educationid
          degreeTitle
          college
          fromYear
          toYear
          createdAt
      }
    }
  }
  `)