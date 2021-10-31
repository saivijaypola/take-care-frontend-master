import { takeLatest, put, call } from 'redux-saga/effects';
import { axiosGet, axiosPost, fetchPost, axiosPostExternal, } from '../../handler/apiHandler';
import { v4 as uuidv4 } from 'uuid';

import { AuthAction, UserActions } from '../actions/index'
import { mutation, query, unAuthorizedMutation, unAuthorizedQuery } from "../../graphql/graphqlHandler";
import postNewRequestGql from '../../graphql/mutation/User/postNewRequest';
import createServiceOrderGql from '../../graphql/mutation/addServiceOrder';
import initiateChatGql from '../../graphql/mutation/updateChat';
import rejectOfferGql from '../../graphql/mutation/rejectOffer'
import addReactionGql from '../../graphql/mutation/addReaction'
import updateRequestGql from '../../graphql/mutation/updateRequest';
import updateRequestStatusGql from '../../graphql/mutation/updateRequestStatus';
import getAllPostsGql from '../../graphql/query/User/getUserDetailsById';
import getAllRespondsGql from '../../graphql/query/getResponses.js'
import getConfirmedRequestsGql from '../../graphql/query/getConfirmedRequests';


import { findWhere, Map } from "react-lodash"
import getOrderClaimsByOrderId from '../../graphql/query/getOrderClaimsByOrderId';

const _ = require('lodash');
//Post New Request

function* initiateChat(action) {
    const graphqlResponse = yield call(mutation, initiateChatGql, action.payload);
    console.log("blaah", graphqlResponse)
    // if (graphqlResponse) {
    //     yield put(UserActions.postNewRequestSuccess(graphqlResponse.createTblRequest.tblRequest))
    // } else {
    //     yield put(UserActions.postNewRequestFailed(graphqlResponse))
    // }
}

function* rejectOffer(action) {
    const graphqlResponse = yield call(mutation, rejectOfferGql, action.payload);
    console.log("reject...", graphqlResponse)
    if (graphqlResponse.updateTblServiceOrderByServiceOrderId) {
        yield put(UserActions.rejectOfferSuccess(graphqlResponse.updateTblServiceOrderByServiceOrderId))
    } else {
        yield put(UserActions.rejectOfferFailed(graphqlResponse))
    }
}

function* addReaction(action) {
    const graphqlResponse = yield call(mutation, addReactionGql, action.payload);
    console.log("react...", graphqlResponse)
}

function* postNewRequest(action) {
    const { isCareSubscription } = action.payload;
    var notificationParams = {
        "latitude": action.payload.inputRequest.latitude,
        "longitude": action.payload.inputRequest.longitude,
        "user_radius": 40000,
        "locationTitle": action.payload.inputRequest.locationTitle,
        "requestId": action.payload.inputRequest.requestId
    }

    // const triggerNotification = yield call(fetchPost, 'https://us-central1-rytzee.cloudfunctions.net/broadCastEmail-dev', notificationParams)
    const graphqlResponse = yield call(mutation, postNewRequestGql, action.payload);

    if (graphqlResponse.createTblRequest) {
        yield call(axiosPost, 'notifyproviders', notificationParams)
        yield put(UserActions.postNewRequestSuccess(graphqlResponse.createTblRequest.tblRequest))
    } else {
        yield put(UserActions.postNewRequestFailed(graphqlResponse))
    }

}
function* createServiceOrder(action) {

    // const triggerNotification = yield call(fetchPost, 'https://us-central1-rytzee.cloudfunctions.net/broadCastEmail-dev', notificationParams)
    const graphqlResponse = yield call(mutation, createServiceOrderGql, action.payload);
    console.log(graphqlResponse)
    if (graphqlResponse.createTblServiceOrder) {
        yield put(UserActions.createServiceOrderSuccess(graphqlResponse.createTblServiceOrder))
    } else {
        yield put(UserActions.createServiceOrderFailed(graphqlResponse))
    }

}

function* updateRequest(action) {

    const graphqlResponse = yield call(mutation, updateRequestGql, action.payload);

    if (graphqlResponse.updateTblRequestByRequestId) {
        yield put(UserActions.updateRequestSuccess(graphqlResponse.updateTblRequestByRequestId.tblRequest))
    } else {
        yield put(UserActions.updateRequestFailed(graphqlResponse))
    }

}

function* updateRequestStatus(action) {

    const graphqlResponse = yield call(mutation, updateRequestStatusGql, action.payload);
    console.log('UPDATE STATUS API', graphqlResponse);
    if (graphqlResponse.updateTblRequestByRequestId) {
        yield put(UserActions.updateRequestStatusSuccess(graphqlResponse.updateTblRequestByRequestId.tblRequest))
    } else {
        yield put(UserActions.updateRequestStatusFailed(graphqlResponse))
    }

}

function* getAllRequests(action) {
    const graphqlResponse = yield call(query, getAllPostsGql, action.payload);
    var allRequests = graphqlResponse.tblUserByUserId && graphqlResponse.tblUserByUserId.tblRequestsByUserId && graphqlResponse.tblUserByUserId.tblRequestsByUserId.nodes

    var requests = []
    if (allRequests.length > 0) {
        var modifiedRequests = allRequests.map((request, index) => {

            if (request.tblServiceOrdersByRequestId && request.tblServiceOrdersByRequestId.nodes && request.tblServiceOrdersByRequestId.nodes.length > 0 && !request.isCareSubscription) {
                var nodes = request.tblServiceOrdersByRequestId.nodes
                var respondStatus = nodes.filter((node) => node.orderStatus === 'Pending')
                var isConfirmed = false
                for (let x = 0; x < nodes.length; x++) {
                    if (nodes[x].orderStatus === 'Confirmed') {
                        isConfirmed = true
                    }
                }
                if (!isConfirmed) {
                    // var respondStatus = nodes
                    var chatNodes = request.tblChatsByRequestId.nodes

                    request.quotesCount = respondStatus.length
                    requests.push(request)

                }

            } else if (request.tblCarePackagesByRequestId && request.tblCarePackagesByRequestId.nodes && request.tblCarePackagesByRequestId.nodes.length > 0){
                var careNodes = request.tblCarePackagesByRequestId.nodes.filter(x => x.status === 'Confirmed')
                var respondStatus = request.tblCarePackagesByRequestId.nodes.filter(x => x.status !== 'draft')
                console.log('CONF', careNodes);
                if (careNodes.length === 0){
                    request.quotesCount = respondStatus.length
                    requests.push(request)
                }
            } else {
                if (request.tblChatsByRequestId && request.tblChatsByRequestId.totalCount > 0) {
                    // request.quotesCount = request.tblChatsByRequestId.totalCount
                } else {
                    request.quotesCount = 0
                }
                requests.push(request)
            }

            

        })
    }

    if (graphqlResponse.error) {
        yield put(UserActions.getAllRequestsFailed(null))
    } else if (requests && requests.length > 0) {
        yield put(UserActions.getAllRequestsSuccess(requests))
    } else {
        yield put(UserActions.getAllRequestsFailed(null))
    }

}



function* getConfirmedRequests(action) {
    const graphqlResponse = yield call(query, getConfirmedRequestsGql, action.payload);
    console.log("CONFIRMED API RESPONSE", graphqlResponse)
    let allServiceOrders = graphqlResponse.allTblServiceOrders && graphqlResponse.allTblServiceOrders.nodes
    let allCareOrders = graphqlResponse.allTblCarePackages && graphqlResponse.allTblCarePackages.nodes
    var allOrders = allServiceOrders.concat(allCareOrders)
    console.log('ALL ORDERS FROM API', allServiceOrders.concat(allCareOrders) );
    if (graphqlResponse.error) {
        yield put(UserActions.getConfirmedRequestsFailed(null))
    } else if (allOrders && allOrders.length > 0) {
        var requests = []
        if (allOrders.length > 0) {
            var confirmedRequest = allOrders.map((request, index) => {
                if (request.careId && request.careId){
                    let careId = { 'careId': request.careId }
                    var careRequest = { ...request.tblRequestByRequestId, ...careId }
                }             
                request.tblRequestByRequestId.status = request.tblOrderByServiceOrderId && request.tblOrderByServiceOrderId.orderStatus ? request.tblOrderByServiceOrderId && request.tblOrderByServiceOrderId.orderStatus : ''
                requests.push(request.careId ? careRequest : request.tblRequestByRequestId)
            })
        }
        console.log('REQUESTS', requests);
        yield put(UserActions.getConfirmedRequestsSuccess(requests))
    } else {
        yield put(UserActions.getConfirmedRequestsFailed(graphqlResponse))
    }

}

function* getProviders(action) {
    const apiResponse = yield call(axiosPost, 'find/providers/', action.payload.locationData);
    console.log('API RESPONSE', apiResponse)
    if (action.payload.requestId) {
        var graphqlResponse = yield call(query, getAllRespondsGql, action.payload.requestId);
    } else {
        var graphqlResponse = null
    }
    var providers_chat = []
    var providers_quote = []
    var providers = []
    var providers_merged = []
    var providers_reacted = []
    console.log("🚀 ~ file: UserSagas.js ~ line 176 ~ function*getProviders ~ graphqlResponse", graphqlResponse)

    if (!action.payload.requestId) {
        yield put(UserActions.getProvidersSuccess(apiResponse && apiResponse.response && apiResponse.response.data && apiResponse.response.data.Providers && apiResponse.response.data.Providers))
    }
    else {

        if (apiResponse.response && apiResponse.response.data && apiResponse.response.data.Providers && apiResponse.response.data.Providers.length > 0) {
            var nearby = apiResponse.response.data.Providers
        }
        if (graphqlResponse && graphqlResponse.tblRequestByRequestId.tblUserReactionsByRequestId && graphqlResponse.tblRequestByRequestId.tblUserReactionsByRequestId.totalCount > 0) {
            providers_reacted = graphqlResponse.tblRequestByRequestId.tblUserReactionsByRequestId.nodes
        }

        if (graphqlResponse && graphqlResponse.tblRequestByRequestId) {
            if (graphqlResponse.tblRequestByRequestId.tblChatsByRequestId && graphqlResponse.tblRequestByRequestId.tblChatsByRequestId.totalCount > 0) {
                var provider = graphqlResponse.tblRequestByRequestId.tblChatsByRequestId.nodes.map((request, index) => {
                    request.tblUserByProviderId.latitude = request.tblUserByProviderId && request.tblUserByProviderId.tblUserLocationByUserId && request.tblUserByProviderId.tblUserLocationByUserId.latitude && request.tblUserByProviderId.tblUserLocationByUserId.latitude
                    request.tblUserByProviderId.longitude = request.tblUserByProviderId && request.tblUserByProviderId.tblUserLocationByUserId && request.tblUserByProviderId.tblUserLocationByUserId.longitude && request.tblUserByProviderId.tblUserLocationByUserId.longitude
                    request.tblUserByProviderId.locationTitle = request.tblUserByProviderId && request.tblUserByProviderId.tblUserLocationByUserId && request.tblUserByProviderId.tblUserLocationByUserId.locationTitle && request.tblUserByProviderId.tblUserLocationByUserId.locationTitle
                    request.tblUserByProviderId.chat = true
                    providers_chat.push(request.tblUserByProviderId)
                })
            }
            if (graphqlResponse.tblRequestByRequestId.tblServiceOrdersByRequestId && graphqlResponse.tblRequestByRequestId.tblServiceOrdersByRequestId.totalCount > 0) {
                var provider = graphqlResponse.tblRequestByRequestId.tblServiceOrdersByRequestId.nodes.map((request, index) => {
                    request.tblUserByProviderId.latitude = request.tblUserByProviderId && request.tblUserByProviderId.tblUserLocationByUserId && request.tblUserByProviderId.tblUserLocationByUserId.latitude && request.tblUserByProviderId.tblUserLocationByUserId.latitude
                    request.tblUserByProviderId.longitude = request.tblUserByProviderId && request.tblUserByProviderId.tblUserLocationByUserId && request.tblUserByProviderId.tblUserLocationByUserId.longitude && request.tblUserByProviderId.tblUserLocationByUserId.longitude
                    request.tblUserByProviderId.locationTitle = request.tblUserByProviderId && request.tblUserByProviderId.tblUserLocationByUserId && request.tblUserByProviderId.tblUserLocationByUserId.locationTitle && request.tblUserByProviderId.tblUserLocationByUserId.locationTitle
                    request.tblUserByProviderId.quote = true
                    request.tblUserByProviderId.serviceOrderId = request.serviceOrderId
                    request.tblUserByProviderId.quoteAmount = request.orderTotalAmount
                    request.tblUserByProviderId.orderStatus = request.orderStatus
                    request.tblUserByProviderId.providerComments = request.providerComments
                    // if(request.orderStatus !=="Rejected"){
                    //     providers_quote.push(request.tblUserByProviderId)
                    // }
                    providers_quote.push(request.tblUserByProviderId)
                })
            }
            console.log("chats", providers_chat)
            console.log("quotes", providers_quote)


            if (providers_quote.length > 0) {
                for (let i = 0; i < providers_quote.length; i++) {
                    providers.push({
                        ...providers_quote[i]
                    });
                }
                providers_quote.sort((a, b) => a.quoteAmount - b.quoteAmount);
            }


            //THIS IS FOR ADMIN AREA
            if (localStorage.getItem('role') === 'admin') {

                //removing duplicate providers when combining chat and quote responds -Old Developer Commment
                if (providers_chat.length > 0) {
                    for (let i = 0; i < providers_chat.length; i++) {
                        providers.push({
                            ...providers_chat[i]
                        }
                        );
                    }
                }
            }

            if (providers.length > 0) {
                for (let i = 0; i < providers.length; i++) {
                    providers_merged.push({
                        ...providers[i]
                    });
                }
            }
            //merging nearby providers and eliminating duplicate entries
            if (nearby && nearby.length > 0) {
                var service_length = providers_merged.length
                for (let i = 0; i < nearby.length; i++) {
                    var duplicate = false
                    for (let j = 0; j < service_length; j++) {
                        if (nearby[i].userId == providers_merged[j].userId) {
                            duplicate = true
                            break;
                        }
                    }
                    if (!duplicate) {
                        providers_merged.push({
                            ...nearby[i]
                        });
                    }
                }
            }
            if (action.payload && action.payload.filters && action.payload.filters.filterBy != "rejectedOnly") {
                if (providers_merged.length > 0) {
                    for (let i = 0; i < providers_merged.length; i++) {
                        if (providers_merged[i].orderStatus === "Rejected") {
                            providers_merged.splice(i, 1)
                            i--
                        }
                    }
                }
            }
        }


        if (providers_reacted.length > 0 && providers_merged.length > 0) {
            for (let i = 0; i < providers_merged.length; i++) {
                for (let j = 0; j < providers_reacted.length; j++) {
                    if (providers_merged[i].userId == providers_reacted[j].providerId) {
                        providers_merged[i].reactionId = providers_reacted[j].reactionId
                        providers_merged[i].isLiked = providers_reacted[j].isLiked
                        providers_merged[i].isDisliked = providers_reacted[j].isDisliked
                    }
                }
            }
        }
        if (action.payload && action.payload.filters && action.payload.filters.likeValue == "liked") {
            for (let i = 0; i < providers_merged.length; i++) {
                if (!providers_merged[i].isLiked == true) {
                    providers_merged.splice(i, 1)
                    i--
                }
            }
        } else if (action.payload && action.payload.filters && action.payload.filters.likeValue == "disliked") {
            for (let i = 0; i < providers_merged.length; i++) {
                if (!providers_merged[i].isDisliked == true) {
                    providers_merged.splice(i, 1)
                    i--
                }
            }
        }



        if (action.payload && action.payload.filters && action.payload.filters.showFull) {
            if (providers_merged.length > 0) {
                yield put(UserActions.getProvidersSuccess(providers_merged))
            } else {
                yield put(UserActions.getProvidersFailed(providers_merged))
            }
        } else {
            for (let i = 0; i < providers_merged.length; i++) {
                if (providers_merged[i].spiffy < action.payload.filters.spiffyMin || providers_merged[i].spiffy > action.payload.filters.spiffyMax) {
                    providers_merged.splice(i, 1)
                    i--
                }
            }
            if (action.payload && action.payload.filters && action.payload.filters.profilePic) {
                for (let i = 0; i < providers_merged.length; i++) {
                    if (providers_merged[i].avatarUrl == "") {
                        providers_merged.splice(i, 1)
                        i--
                    }
                }
            }
            if (action.payload && action.payload.filters && action.payload.filters.filterBy == "rejectedOnly") {
                if (providers_quote.length > 0) {
                    var providers_quote_final = []
                    for (let i = 0; i < providers_merged.length; i++) {
                        if (providers_merged[i].quote == true && providers_merged[i].orderStatus === "Rejected") {
                            providers_quote_final.push({
                                ...providers_merged[i]
                            });
                        }
                    }
                    yield put(UserActions.getProvidersSuccess(providers_quote_final))
                } else {
                    yield put(UserActions.getProvidersFailed(providers_quote_final))
                }
            } else if (action.payload && action.payload.filters && action.payload.filters.filterBy == "quotesOnly") {
                if (providers_quote.length > 0) {
                    var providers_quote_final = []
                    for (let i = 0; i < providers_merged.length; i++) {
                        if (providers_merged[i].quote == true) {
                            providers_quote_final.push({
                                ...providers_merged[i]
                            });
                        }
                    }
                    providers_quote_final.sort((a, b) => a.quoteAmount - b.quoteAmount)
                    yield put(UserActions.getProvidersSuccess(providers_quote_final))
                } else {
                    yield put(UserActions.getProvidersFailed(providers_quote_final))
                }
            } else if (localStorage.getItem('role') === 'admin' && action.payload && action.payload.filters && action.payload.filters.activeChat && action.payload.filters.activeChat === true) {
                //THIS IS FOR ADMIN AREA
                if (providers_chat.length > 0) {
                    var providers_chat_final = []
                    // for (let i = 0; i < providers_merged.length; i++) {
                    //     if (providers_merged[i].chat == true) {
                    //         providers_chat_final.push({
                    //             ...providers_merged[i]
                    //         });
                    //     }
                    // }
                    yield put(UserActions.getProvidersSuccess(providers_chat))
                } else {
                    yield put(UserActions.getProvidersFailed([]))
                }


            } else {
                if (providers_merged.length > 0) {
                    yield put(UserActions.getProvidersSuccess(providers_merged))
                } else {
                    yield put(UserActions.getProvidersFailed(providers_merged))
                }
            }
        }

    }


}

function* getNearByProviders(action) {
    const apiResponse = yield call(axiosPost, 'find/providers/', action.payload.locationData);
    console.log(action.payload.filters)
    if (apiResponse.response && apiResponse.response.data.Providers) {
        yield put(UserActions.getNearByProvidersSuccess(apiResponse.response.data.Providers))
    } else {
        yield put(UserActions.getNearByProvidersFailed(apiResponse))
    }

}

function* getAllResponds(action) {
    // const apiResponse = yield call(axiosGet, `providers/${action.payload.requestid}`);
    const graphqlResponse = yield call(query, getAllRespondsGql, action.payload);
    console.log("yeeha", graphqlResponse)
    var providers_chat = []
    var providers_quote = []
    var providers = []
    var providers_merged = []
    console.log("real response", graphqlResponse)
    if (graphqlResponse.tblRequestByRequestId) {
        if (graphqlResponse.tblRequestByRequestId.tblChatsByRequestId && graphqlResponse.tblRequestByRequestId.tblChatsByRequestId.totalCount > 0) {
            var provider = graphqlResponse.tblRequestByRequestId.tblChatsByRequestId.nodes.map((request, index) => {
                request.tblUserByProviderId.latitude = request.tblUserByProviderId && request.tblUserByProviderId.tblUserLocationByUserId && request.tblUserByProviderId.tblUserLocationByUserId.latitude && request.tblUserByProviderId.tblUserLocationByUserId.latitude
                request.tblUserByProviderId.longitude = request.tblUserByProviderId && request.tblUserByProviderId.tblUserLocationByUserId && request.tblUserByProviderId.tblUserLocationByUserId.longitude && request.tblUserByProviderId.tblUserLocationByUserId.longitude
                request.tblUserByProviderId.locationTitle = request.tblUserByProviderId && request.tblUserByProviderId.tblUserLocationByUserId && request.tblUserByProviderId.tblUserLocationByUserId.locationTitle && request.tblUserByProviderId.tblUserLocationByUserId.locationTitle
                request.tblUserByProviderId.chat = true
                providers_chat.push(request.tblUserByProviderId)
            })
        }
        if (graphqlResponse.tblRequestByRequestId.tblServiceOrdersByRequestId && graphqlResponse.tblRequestByRequestId.tblServiceOrdersByRequestId.totalCount > 0) {
            var provider = graphqlResponse.tblRequestByRequestId.tblServiceOrdersByRequestId.nodes.map((request, index) => {
                request.tblUserByProviderId.latitude = request.tblUserByProviderId && request.tblUserByProviderId.tblUserLocationByUserId && request.tblUserByProviderId.tblUserLocationByUserId.latitude && request.tblUserByProviderId.tblUserLocationByUserId.latitude
                request.tblUserByProviderId.longitude = request.tblUserByProviderId && request.tblUserByProviderId.tblUserLocationByUserId && request.tblUserByProviderId.tblUserLocationByUserId.longitude && request.tblUserByProviderId.tblUserLocationByUserId.longitude
                request.tblUserByProviderId.locationTitle = request.tblUserByProviderId && request.tblUserByProviderId.tblUserLocationByUserId && request.tblUserByProviderId.tblUserLocationByUserId.locationTitle && request.tblUserByProviderId.tblUserLocationByUserId.locationTitle
                request.tblUserByProviderId.quote = true
                providers_quote.push(request.tblUserByProviderId)
            })
        }
        //tblUserReactionsByRequestId

        console.log("chats", providers_chat)
        console.log("quotes", providers_quote)
        if (providers_chat.length > 0) {
            for (let i = 0; i < providers_chat.length; i++) {
                providers.push({
                    ...providers_chat[i]
                });
            }
        }
        if (providers_quote.length > 0) {
            for (let i = 0; i < providers_quote.length; i++) {
                providers.push({
                    ...providers_quote[i]
                });
            }
        }
        if (providers.length > 0) {
            for (let i = 0; i < providers.length; i++) {
                for (let j = i + 1; j < providers.length; j++) {
                    if (providers[i].userId == providers[j].userId) {
                        providers[i].chat = true
                        providers[i].quote = true
                        providers.splice(j, 1)
                        break;
                    }
                }
                providers_merged.push({
                    ...providers[i]
                });
            }
        }
        yield put(UserActions.getRespondsFromProviderSuccess(providers_merged))
    } else {
        yield put(UserActions.getRespondsFromProviderFailed([]))
    }

}

function* getOrderClaimsByOrder(action) {
    let data = {
        "orderId": action.payload.orderId
    }
    const graphqlResponse = yield call(query, getOrderClaimsByOrderId, data);
    console.log(graphqlResponse)
    if (graphqlResponse.allTblOrderClaims) {
        yield put(UserActions.getOrderClaimsByOrderSuccess(graphqlResponse.allTblOrderClaims))
    } else {
        yield put(UserActions.getOrderClaimsByOrderFailed(graphqlResponse))
    }
}

//Update Care Package MTP Status
function* updateMtpStatus(action) {
    const careid = action.payload;
    const apiResponse = yield call(axiosGet, `care/updatestatus/${careid}/optedmtp`, action.payload);
    console.log('MTP UPDATE', apiResponse);

    if (apiResponse.error === null && apiResponse.response.status === 200) {
        yield put(UserActions.updateMtpStatusSuccess(apiResponse.response))
    } else {
        yield put(UserActions.updateMtpStatusFailed(apiResponse))
    }

}



export default function* UserSagas() {
    yield takeLatest(UserActions.ADD_REACTION, addReaction);
    yield takeLatest(UserActions.REJECT_OFFER, rejectOffer);
    yield takeLatest(UserActions.INITIATE_CHAT, initiateChat);
    yield takeLatest(UserActions.POST_NEW_REQUEST, postNewRequest);
    yield takeLatest(UserActions.CREATE_SERVICE_ORDER, createServiceOrder);
    yield takeLatest(UserActions.UPDATE_REQUEST, updateRequest);
    yield takeLatest(UserActions.UPDATE_REQUEST_STATUS, updateRequestStatus);
    yield takeLatest(UserActions.GET_ALL_REQUESTS, getAllRequests);
    yield takeLatest(UserActions.GET_PROVIDERS, getProviders);
    yield takeLatest(UserActions.GET_NEARBY_PROVIDERS, getNearByProviders);
    yield takeLatest(UserActions.GET_CONFIRMED_REQUESTS, getConfirmedRequests);
    yield takeLatest(UserActions.GET_RESPONDS_PROVIDER, getAllResponds);
    yield takeLatest(UserActions.GET_ORDER_CLAIMS_BY_ORDER_ID, getOrderClaimsByOrder);
    yield takeLatest(UserActions.UPDATE_MTP_STATUS, updateMtpStatus);
}