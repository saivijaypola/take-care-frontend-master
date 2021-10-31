import gql from "graphql-tag";
export default gql(`
query($id:String!){
  tblUserByUserId(userId: $id){
    nodeId
    userId
    username
    fullname
    email
    password
    phoneNumber
    countryCode
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
    title
    spiffy
    createdAt
    updatedAt
    deletedAt
    tblUserReactionsByUserId{
      totalCount
      nodes{
        requestId
        reactionId
        providerId
        isLiked
        isDisliked
        isVisible
        userId
        updatedAt
        createdAt
      }
    }
    tblEmploymentsByUserId(orderBy:FROM_YEAR_DESC){
      nodes{
        employmentId
        jobTitle
        companyName
        fromYear
        toYear
        description
      }
    }
    tblEducationsByUserId(orderBy:FROM_YEAR_DESC){
      nodes{
        educationid
        degreeTitle
        college
        toYear
        fromYear
        createdAt
      }
    }
    tblRecommendationsByUserId{
      nodes{
        recommendationId
        jobTitle
        name
        isVerified
        email
        comment
        isCommentPublic
      }
    }
    tblUserLocationByUserId{
      locationId
      locationTitle
      latitude
      longitude
    }
    tblTrainingsByUserId(orderBy:YEAR_DESC){
      nodes{
        trainingId
        title
        issuingAuthority
        year
        description
        
      }
    }
    tblDocumentUploadsByUserId{
      nodes{
        documenttype
        isVerified
      }
    }
  }
}
  `);
