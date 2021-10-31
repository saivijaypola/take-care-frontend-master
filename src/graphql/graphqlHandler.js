
import ApolloClient from 'apollo-boost'
import { HttpLink, createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getUser } from '../handler/authenticate'
import firebase from "firebase/app";
let graphqlEndpoint = process.env.REACT_APP_GRAPHQL_URI

 


export const mutation = async (gql, variables) => {


    try {
        return new Promise((resolve, reject) => {


            firebase.auth().onAuthStateChanged(async function (user) {

                if (user !== null) {

                    const graphqlClient = new ApolloClient(
                        {
                            uri: graphqlEndpoint,
                            headers: {
                                // "x-access-token": getUser() ? getUser().idToken : ''
                                "x-access-token": await firebase.auth().currentUser.getIdToken()
                            }
                        }
                    );

                    graphqlClient.mutate({
                        fetchPolicy: "no-cache",
                        mutation: gql,
                        variables: variables
                    }).then((response) => {
                        if (response.data) {
                            resolve(response.data)
                        } else {
                            reject(response.errors)
                        }
                    }).catch((err) => {
                        reject(err)
                    })
                }

            })

        }).catch((err) => {

            return {
                error: err
            }
        })
    } catch (err) {

        return {
            error: err
        }
    }



}


export const unAuthorizedMutation = async (gql, variables) => {


    try {
        return new Promise((resolve, reject) => {

            const graphqlClient = new ApolloClient(
                {
                    uri: graphqlEndpoint
                }
            );

            graphqlClient.mutate({
                fetchPolicy: "no-cache",
                mutation: gql,
                variables: variables
            }).then((response) => {
                if (response.data) {
                    resolve(response.data)
                } else {
                    reject(response.errors)
                }
            }).catch((err) => {
                reject(err)
            })


        }).catch((err) => {

            return {
                error: err
            }
        })
    } catch (err) {

        return {
            error: err
        }
    }



}

export const query = async (gql, variables) => {

    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(async function (user) {

            if (user !== null) {
                const graphqlClient = new ApolloClient(
                    {
                        uri: graphqlEndpoint,
                        headers: {
                            //  "x-access-token": getUser() ? getUser().idToken : ''
                            "x-access-token": await firebase.auth().currentUser.getIdToken()
                        }
                    }
                );

                graphqlClient.query({
                    fetchPolicy: "network-only",
                    query: gql,
                    variables: variables
                }).then((response) => {
                    if (response.data) {
                        resolve(response.data)
                    } else {
                        reject(response.errors)
                    }
                }).catch((err) => {
                    reject(err)
                })
            }


        })

    })

}


export const unAuthorizedQuery = async (gql, variables) => {


    const graphqlClient = new ApolloClient(
        {
            uri: graphqlEndpoint
        }
    );

    return new Promise((resolve, reject) => {

        graphqlClient.query({
            fetchPolicy: "network-only",
            query: gql,
            variables: variables
        }).then((response) => {
            if (response.data) {
                resolve(response.data)
            } else {
                reject(response.errors)
            }
        }).catch((err) => {
            reject(err)
        })
    })



}

