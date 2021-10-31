import gql from "graphql-tag";
export default gql(`
query getDelights{
    allTblProducts{
    nodes {
    nodeId
    productId
    providerId
    productTitle
    subTitle
    productDescription
    price
    coverImages
    availableRadius
    isVisible
    createdAt
    updatedAt
    deletedAt
    itemsIncluded
    tblUserByProviderId {
    nodeId
    userId
    username
    email
    fullname
    aboutme
    password
    phoneNumber
    tblSubscriptionBySubscriptionId {
    nodeId
    subscriptionId
    title
    monthlyFee
    transactionFee
    otherServiceFee
    createdAt
    updatedAt
    deletedAt
    }
    tblUserLocationByUserId {
    nodeId
    locationId
    locationTitle
    userId
    latitude
    longitude
    whereIs
    }
    }
    }
    totalCount
    }
   }`);