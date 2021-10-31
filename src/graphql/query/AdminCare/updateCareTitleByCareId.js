import gql from "graphql-tag";

export default gql(`
mutation updateCareTitle($careId: UUID!, $careTitle: TblCarePackagePatch!){
    updateTblCarePackageByCareId(input: {careId: $careId, tblCarePackagePatch: $careTitle}){
      clientMutationId
      tblCarePackage {
        careTitle
      }
    }
  }
`)