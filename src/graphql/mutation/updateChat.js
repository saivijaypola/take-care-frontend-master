
import gql from "graphql-tag";

export default gql(`
mutation updatetblChatById($chatId: UUID!, $chatInfo: TblChatPatch!) {
    updateTblChatByChatId(input: { chatId: $chatId, tblChatPatch: $chatInfo }) {
      clientMutationId
      tblChat {
        chatId
      }
    }
  }
  `)





