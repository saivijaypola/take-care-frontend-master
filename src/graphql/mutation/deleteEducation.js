
import gql from "graphql-tag";

export default gql(`
mutation deleteEducationById($educationId: UUID!) {
  deleteTblEducationByEducationid(input: { educationid: $educationId }) {
    clientMutationId
    tblEducation {
      nodeId
      educationid
      userId
      degreeTitle
      college
      fromYear
      toYear
      createdAt
      updatedAt
      deletedAt
    }
  }
}
  `)