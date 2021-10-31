import gql from "graphql-tag";
export default gql(`
query getAllCareOrdersByCareId($careId: UUID!){
    allTblCareOrders(condition: {careId: $careId}){
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
        careProviderId
      }
      totalCount
    }
  }

`);