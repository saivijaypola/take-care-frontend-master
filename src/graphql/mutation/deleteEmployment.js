
import gql from "graphql-tag";

export default gql(`
mutation deleteEmployment($empId: UUID!) {
    deleteTblEmploymentByEmploymentId(input: { employmentId: $empId }) {
      tblEmployment {
        employmentId
      }
    }
  }  
  `)