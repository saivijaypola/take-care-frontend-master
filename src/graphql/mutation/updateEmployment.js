
import gql from "graphql-tag";

export default gql(`
mutation updateEmployment(
    $employmentId: UUID!
    $employment: TblEmploymentPatch!
  ) {
    updateTblEmploymentByEmploymentId(
      input: { employmentId: $employmentId, tblEmploymentPatch: $employment }
    ) {
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