import gql from "graphql-tag";

export default gql(`
mutation addUserReaction(
    $reaction_id: UUID
    $user_id: String
    $provider_id: String
    $request_id: UUID
    $is_liked: Boolean
    $is_disliked: Boolean
    $user_reason: String
    $is_visible: Boolean
  ) {
    yocoFunUserReaction(
      input: {
        reactionId: $reaction_id
        userId: $user_id
        providerId: $provider_id
        requestId: $request_id
        isLiked: $is_liked
        isDisliked: $is_disliked
        userReason: $user_reason
        isVisible: $is_visible
      }
    ) {
      clientMutationId
      json
    }
  }
    `)