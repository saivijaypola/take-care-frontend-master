import gql from "graphql-tag";
export default gql(`
query($email:String!){
    tblUserByEmail(email: $email){
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
    createdAt
    updatedAt
    deletedAt
     
    }
  }
  `);
