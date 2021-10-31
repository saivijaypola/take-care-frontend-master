
import gql from "graphql-tag";

export default gql(`
mutation createRequest($inputRequest: TblRequestInput!) {
  createTblRequest(input: { tblRequest: $inputRequest }) {
    clientMutationId
    tblRequest {
      requestId
      title
      description
      userId
      locationTitle
      latitude
      longitude
      isHealthcare
      isDisabled
      isCompleted
      serviceNeedsOn
      serviceEndsOn
      isDateFlexible
      createdAt
    }
  }
}

  `)