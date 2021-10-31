
import gql from "graphql-tag";

export default gql(`
mutation updateEducation(
  $educationId: UUID!
  $educationPatch: TblEducationPatch!
) {
  updateTblEducationByEducationid(
    input: { educationid: $educationId, tblEducationPatch: $educationPatch }
  ) {
    clientMutationId
    tblEducation {
      nodeId
      educationid
      userId
      degreeTitle
      college
      fromYear
      toYear
    }
  }
}
  `)