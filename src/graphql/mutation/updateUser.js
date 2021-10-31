

import gql from "graphql-tag";

export default gql(`
mutation($tblUser:TblUserPatch!,$id:String!){ 
    updateTblUserByUserId(input:{
      userId:$id,tblUserPatch:$tblUser
    }){
      clientMutationId
      tblUser{
        userId
        email
        username        
      }
    }
  }
  `)

  