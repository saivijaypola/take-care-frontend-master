import gql from "graphql-tag";
export default gql(`
query ($id:String!){
    tblUserByUserId(userId: $id){
      nodeId
      userId
      tblEmploymentsByUserId{
        nodes{
          employmentId
        }
      }
      tblEducationsByUserId{
        nodes{
          educationid
        }
      }
      tblTrainingsByUserId{
        nodes{
          trainingId
        }
      }
      tblDocumentUploadsByUserId{
        nodes{
          userId
           documenttype
        }
      }
    }
  }
  `);
