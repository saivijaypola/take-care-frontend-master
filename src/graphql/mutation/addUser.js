
import gql from "graphql-tag";

export default gql(`
mutation($tblUser: TblUserInput!) {
    createTblUser(input: { tblUser: $tblUser }) {
      clientMutationId
      tblUser {
        userId
        username
      }
    }
  }
  `)