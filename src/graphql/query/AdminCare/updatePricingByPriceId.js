import gql from "graphql-tag";

export default gql(`
mutation updatePricing($priceId:UUID!, $pricingData: TblPackagePricingPatch! ){
    updateTblPackagePricingByPriceId(input: { priceId: $priceId, tblPackagePricingPatch: $pricingData}){
      clientMutationId
      tblPackagePricing{
        priceId
        priceItem
        amount
      }
    }
  }
  `)