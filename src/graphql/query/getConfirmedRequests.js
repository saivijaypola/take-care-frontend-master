import gql from "graphql-tag";
export default gql(`
query getAllConfirmedRequests($userId: String!, $status: String!, ) {
  allTblServiceOrders(condition: { orderStatus: $status, userId: $userId }) {
  nodes {
  serviceOrderId
  orderStatus
  tblOrderByServiceOrderId {
  orderStatus
  }
  tblRequestByRequestId {
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
  totalCount
  }
  allTblCarePackages(condition: {userId: $userId, status: $status}){
  nodes{
    careId
    careTitle
    careDescription
    tblCareOrdersByCareId{
  nodes {
    orderStatus
    orderAcceptedOn
  }
}
    tblRequestByRequestId {
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
  isCareSubscription
  status
  }
  }
  totalCount
}
}

`);