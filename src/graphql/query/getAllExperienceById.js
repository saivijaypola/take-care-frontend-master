import gql from "graphql-tag";
export default gql(`
query{
    allTblUsers{
      nodes{
        username
        subscriptionId
        email
        subscriptionId
      }
    }
  }`);