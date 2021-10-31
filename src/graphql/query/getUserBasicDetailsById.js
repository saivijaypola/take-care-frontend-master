import gql from "graphql-tag";
export default gql(`
query($userId:String!){
  tblUserByUserId(userId: $userId){
    nodeId
    userId
    username
    fullname
    email
    password
    phoneNumber
    adressline1
    adressline2
    city
    state
    aboutme
    country
    zipCode
    isVerified
    avatarUrl
    healthCareProfessional
    verificationStatus
    rating
    role
    tblUserLocationByUserId{
      locationId
      locationTitle
      latitude
      longitude
    }
    createdAt
    updatedAt
    deletedAt
  }
}
  `);
