import gql from "graphql-tag";
export default gql(`
query getServiceDetails($requestid: UUID, $providerid: String) {
  allTblServiceOrders(
    condition: { requestId: $requestid, providerId: $providerid }
  ) {
    nodes {
      nodeId
      serviceOrderId
      requestId
      userId
      providerId
      serviceNeededOn
      orderTotalAmount
      advanceAmount
      amountPaid
      paymentMethod
      countryCode
      phoneNumber
      providerComments
      userComments
      rating
      orderStatus
      createdAt
      tblUserByProviderId{
        userId
        phoneNumber
        countryCode
        fullname
        avatarUrl
        aboutme
        email
        spiffy
        tblUserLocationByUserId{
          latitude
          longitude
          locationTitle
        }
      }
    }
  }
}
`);