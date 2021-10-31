import gql from "graphql-tag";
export default gql(`
query getRecommendationById($recommendationId:UUID!){
  tblRecommendationByRecommendationId(recommendationId: $recommendationId){
    nodeId
    recommendationId
    userId
    name
    email
    jobTitle
    tblUserByUserId{
      fullname
      email
      avatarUrl
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
          college
          toYear
          fromYear
          createdAt
        }
      }
      tblTrainingsByUserId{
        nodes{
          trainingId
          title
          issuingAuthority
          year
          description
          
        }
      }
    }
  }
}
  `);