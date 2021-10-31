import gql from "graphql-tag";
export default gql(`
query getProviderCareDetails($providerId: String!, $careid: UUID!){
    allTblCareProviders(condition: {providerId: $providerId, careId: $careid}){
      nodes {
        supportDescription
        briefDescription
        yocoComments
        monthlyFee
        perVisitCharge
        noOfVisits
        providerFee
      }
      totalCount
    }
  }

`);