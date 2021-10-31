import axios from "axios";
import firebase from "firebase/app";
import LocalStorageService from '../utils/localStorageService';
import { getUser } from "./authenticate";

const localStorageService = LocalStorageService.getService();


const apiBaseUrl = process.env.REACT_APP_SERVICES_URI;
const idfYapiBaseUrl = process.env.REACT_APP_IDFY_API_URL;

const accountId = process.env.REACT_APP_IDFY_ACCOUNT_ID
const idfyApiKey = process.env.REACT_APP_IDFY_API_KEY

//Initialize axios interceptor

export function fetchPost(endPoint, reqData) {
    console.log(endPoint)
    return fetch(endPoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: reqData
    }).then(response => {
        console.log("response", response)
        return { error: null, response: response, resultCode: 1 };

    }).catch(function (error) {
        console.log("errors", error)
        return { error: error, resultCode: 0 };
    });
}
export function axiosGet(endPoint) {
    return axios
        .get(`${apiBaseUrl}${endPoint}`)
        .then(response => {

            if ((response.status >= 200 && response.status < 300) || response.status === 304) {
                return ({ error: null, response: response, resultCode: 1 })
            } else {
                return { error: response, resultCode: 2 }
            }

        })
        .catch(error => {

            return { error: error, resultCode: 2 }
        });
}
export function axiosPut(endPoint, reqdata) {
    try {
        return axios
            .put(`${apiBaseUrl}${endPoint}`, reqdata, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {

                if ((response.status >= 200 && response.status < 300) || response.status === 304) {
                    return { error: null, response: response, resultCode: 1 }
                } else {
                    return { error: response }
                }
            })
            .catch(error => {
                return { error: error.data, resultCode: 2 }
            });
    } catch (error) {

    }

}

export function axiosPostExternal(endPoint, reqdata) {

    try {
        return axios
            .post(`${apiBaseUrl}${endPoint}`, reqdata, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {

                if ((response.status >= 200 && response.status < 300) || response.status === 304) {
                    return { error: null, response: response, resultCode: 1 }
                } else {
                    return { error: response, resultCode: 2 }
                }
            })
            .catch(error => {
                return { error: error, response: null, resultCode: 2 }
            });
    } catch (error) {

    }

}

export function axiosPost(endPoint, reqdata) {

    try {
        return axios
            .post(`${apiBaseUrl}${endPoint}`, reqdata, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {

                if ((response.status >= 200 && response.status < 300) || response.status === 304) {
                    return { error: null, response: response, resultCode: 1 }
                } else {
                    return { error: response, resultCode: 2 }
                }
            })
            .catch(error => {
                return { error: error, response: null, resultCode: 2 }
            });
    } catch (error) {

    }

}

export function axiosIdfyPost(endPoint, reqdata) {

    try {
        return axios
            .post(`${idfYapiBaseUrl}${endPoint}`, reqdata, {
                headers: {
                    'Content-Type': 'application/json',
                    "account-id": accountId,
                    "api-key": idfyApiKey
                }
            })
            .then((response) => {

                if ((response.status >= 200 && response.status < 300) || response.status === 304) {
                    return { error: null, response: response, resultCode: 1 }
                } else {
                    return { error: response, resultCode: 2 }
                }
            })
            .catch(error => {
                return { error: error.response, response: null, resultCode: 2 }
            });
    } catch (error) {

    }

}


export function axiosPatch(endPoint, reqdata) {
    try {
        return axios
            .patch(`${apiBaseUrl}${endPoint}`, reqdata, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {

                if ((response.status >= 200 && response.status < 300) || response.status === 304) {
                    return { error: null, response: response, resultCode: 1 }
                } else {
                    return { error: response, resultCode: 2 }
                }
            })
            .catch(error => {
                return { error: error.response, resultCode: 2 }
            });
    } catch (error) {

    }

}

export function axiosDelete(endPoint) {
    try {
        return axios
            .delete(`${apiBaseUrl}${endPoint}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {

                if ((response.status >= 200 && response.status < 300) || response.status === 304) {
                    return { error: null, response: response, resultCode: 1 }
                } else {
                    return { error: response, resultCode: 2 }
                }
            })
            .catch(error => {
                return { error: error, resultCode: 2 }
            });
    } catch (error) {

    }

}