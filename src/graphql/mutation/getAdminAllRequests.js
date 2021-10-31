
import gql from "graphql-tag";

export default gql(`mutation{
    yocoFunGetAllRequest(input:{}){
      clientMutationId
      json
    }
  }`
)