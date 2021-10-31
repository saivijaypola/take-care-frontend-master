import gql from "graphql-tag";
export default gql(`
mutation updateRecommendation(
  $recommendId: UUID!
  $recommendInput: TblRecommendationPatch!
) {
  updateTblRecommendationByRecommendationId(
    input: {
      recommendationId: $recommendId
      tblRecommendationPatch: $recommendInput
    }
  ) {
    clientMutationId
    tblRecommendation {
      recommendationId
    }
  }
}
  `);
