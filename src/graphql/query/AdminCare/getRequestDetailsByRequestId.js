import gql from "graphql-tag";
export default gql(`
query getRequestById($requestId:UUID!){
  tblRequestByRequestId(requestId:$requestId ){
    nodeId
    title
    description
    userId
    locationTitle
    latitude
    longitude
    isHealthcare
    isCareSubscription
    serviceNeedsOn
    serviceEndsOn
    status
    tblServiceOrdersByRequestId{
      nodes{
        serviceOrderId
        providerId
        orderStatus
      }
      totalCount
    }
    tblUserByUserId{
      phoneNumber
      countryCode
      fullname
      adressline1
      adressline2
      city
      state
      email
      country
    }
  }
}`);