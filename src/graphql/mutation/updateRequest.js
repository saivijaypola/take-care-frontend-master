

import gql from "graphql-tag";

export default gql(`
mutation updateRequest($requestId: UUID!, $requestData: TblRequestPatch!) {
  updateTblRequestByRequestId(
    input: { requestId: $requestId, tblRequestPatch: $requestData }
  ) {
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

