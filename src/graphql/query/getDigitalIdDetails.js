import gql from "graphql-tag";
export default gql(`
query getDigitalIdInfoFromServiceOrder($serviceOrderId: UUID!) {
  tblServiceOrderByServiceOrderId(serviceOrderId: $serviceOrderId) {
    nodeId
    serviceOrderId
    digitalIdCode
    tblUserByProviderId {
      userId
      spiffy
      fullname
      avatarUrl
    }
  }
}
`);