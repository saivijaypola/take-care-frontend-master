
import gql from "graphql-tag";

export default gql(`
  mutation updateTblServiceOrderStatus(
    $serviceOrderPatch: TblServiceOrderPatch!
    $serviceOrderId: UUID!
  ) {
    updateTblServiceOrderByServiceOrderId(
      input: {
        serviceOrderId: $serviceOrderId
        tblServiceOrderPatch: $serviceOrderPatch
      }
    ) {
      clientMutationId
      tblServiceOrder {
        serviceOrderId
        orderStatus
      }
    }
  }
    `)