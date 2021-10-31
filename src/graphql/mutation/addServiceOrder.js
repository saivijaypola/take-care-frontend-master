import gql from "graphql-tag";

export default gql(`
mutation addNewServiceOrder($serviceOrder: TblServiceOrderInput!) {
  createTblServiceOrder(input: { tblServiceOrder: $serviceOrder }) {
    clientMutationId
    tblServiceOrder {
      serviceOrderId
    }
  }
}
    `)