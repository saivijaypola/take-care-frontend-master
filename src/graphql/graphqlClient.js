import ApolloClient from 'apollo-boost'
import { HttpLink, createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getUser } from '../handler/authenticate'
import { auth } from "firebase";

let graphqlEndpoint = process.env.REACT_APP_GRAPHQL_URI

 
async const client = new ApolloClient(
    {
        uri: graphqlEndpoint,
        headers: {
            //  "x-access-token": getUser()? getUser().idToken  : ''
            "x-access-token": await auth().currentUser.getIdToken()
        }
    }
);

// const client = new ApolloClient({
//     uri: `${ graphqlEndpoint }/graphql`, cache: new InMemoryCache({
//         dataIdFromObject: o => { o.id ? `${o.__typename}-${o.id}` : `${o.__typename}-${o.cursor}` },
//     })
// })


export default client