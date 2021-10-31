import gql from "graphql-tag";
export default gql(`
query getChatData($requestid: UUID, $userid: String, $providerid: String) {
  allTblChats(
    condition: {
      requestId: $requestid
      userId: $userid
      providerId: $providerid
    }
  ) {
    nodes {
      chatId
      requestId
      userId
      providerId
    }
    totalCount
  }
}

  `);
