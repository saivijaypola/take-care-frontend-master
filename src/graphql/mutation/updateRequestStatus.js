import gql from "graphql-tag";

export default gql(`
mutation updateRequestStatus($requestId: UUID!, $requestData: TblRequestPatch!) {
    updateTblRequestByRequestId(
      input: { requestId: $requestId, tblRequestPatch: $requestData }
    ) {
      clientMutationId
      tblRequest {
        status
      }
    }
  }
  `)