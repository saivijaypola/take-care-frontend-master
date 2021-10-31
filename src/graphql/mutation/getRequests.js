
import gql from "graphql-tag";

export default gql(`
mutation getNearByRequests($latitude:Float,$longitude:Float,$radius:Float){
    yocoFunGetNearbyRequests(input:{userLongitude:$longitude,userLatitude:$latitude, userRadius:$radius} ){
    clientMutationId
    json
    }
   }
  `)