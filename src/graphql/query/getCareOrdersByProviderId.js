import gql from "graphql-tag";
export default gql(`
query getAllCareOrdersByProviderId($providerId: String!){
  allTblCareOrders(condition: {providerId: $providerId}){
    nodes {
      careOrderId
      careId
      orderAcceptedOn
      orderStatus
      userFullName
      userAddress
      countryCode
      userContactNo
      selectedCurrency
      providerFee
      oneTimeFee
      grandTotal
      digitalIdCode
      createdAt
      totalPayable
      serviceCharge
      providerId
      tblCarePackageByCareId {
        careTitle
        careId
        careDescription
        billingDate
        requestId
      }
    }
    totalCount
  }
}

`);