import gql from "graphql-tag";
export default gql(`
query getOrderClaimsByOrderId($orderId :UUID!){
  
    allTblOrderClaims(condition: {
      orderId:$orderId
    }){
      nodes{
        claimAmountInUserCurrency
        providerCurrency
        claimAmountInProviderCurrency
        
      }
      
      totalCount
    }
  
  }
  `);