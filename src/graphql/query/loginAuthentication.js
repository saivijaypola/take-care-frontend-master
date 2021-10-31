import gql from "graphql-tag";
export default gql(`
query($username:String!,$pwd:String!){
  allTblUsers(condition: {username:$username,password:$pwd}){
    nodes{
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
      specialities
      healthCareProfessional
      verificationStatus
      trainings
      rating
      recomendations
      verificationId
      scannedProofImage
      role
      createdAt
      updatedAt
      deletedAt
      tblEmploymentsByUserId{
        nodes{
          employmentId
          jobTitle
          companyName
          fromYear
          toYear
          description
        }
      }
      tblEducationsByUserId{
        nodes{
          educationid
          degreeTitle
          yearOfPassing
          createdAt
        }
      }
    }
    
    totalCount
  }
}`);
