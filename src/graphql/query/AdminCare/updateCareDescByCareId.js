import gql from "graphql-tag";

export default gql(`
mutation updateCareDesc($careId: UUID!, $careDesc: TblCarePackagePatch!){
    updateTblCarePackageByCareId(input: {careId: $careId, tblCarePackagePatch: $careDesc}){
      clientMutationId
      tblCarePackage {
        careDescription
      }
    }
  }`)