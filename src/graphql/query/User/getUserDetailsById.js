
import gql from "graphql-tag";

export default gql(`
query($id:String!){
  tblUserByUserId(userId: $id){
    nodeId
    userId
    username
    fullname
    tblRequestsByUserId(orderBy:CREATED_AT_DESC) {
      nodes {
        nodeId
        requestId
        serviceCategory
        title
        description
        userId
        locationTitle
        latitude
        isCareSubscription
        longitude
        isHealthcare
        isDisabled
        isCompleted
        serviceNeedsOn
        serviceEndsOn
        isDateFlexible
        createdAt
        status
        tblChatsByRequestId(condition:{chatInititated:true}){
          nodes{
            providerId
          }
          totalCount
        }
        tblServiceOrdersByRequestId{
          nodes{
            serviceOrderId
            orderStatus
            providerId
          }
          totalCount
        }
        tblCarePackagesByRequestId{
          nodes{
            careId
            status
          }
        }
      }
      totalCount
    }
  }
}
  `)