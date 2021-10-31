import { takeLatest, put, call } from 'redux-saga/effects';
import { axiosGet, axiosPost } from '../../handler/apiHandler';
import { v4 as uuidv4 } from 'uuid';

import { RequestActions, AdminActions } from '../actions/index'
import { mutation, query, unAuthorizedMutation, unAuthorizedQuery } from "../../graphql/graphqlHandler";
import getRequests from "../../graphql/mutation/getRequests";
import getRequestDetails from "../../graphql/query/getRequestDetails"
import getServiceDetailsGql from "../../graphql/query/getServiceDetails"
import getDigitalIdGql from "../../graphql/query/getDigitalIdDetails"
import getChatDataGql from "../../graphql/query/getChatData"
import getUserById from '../../graphql/query/getUserById';
import getDelightsGql from '../../graphql/query/getDelights';
import getDelightsByIdGql from '../../graphql/query/getDelightsById';
import { getChat } from '../actions/RequestActions';
import getAdminAllRequests from '../../graphql/mutation/getAdminAllRequests';
import getCareOrdersByCareId from '../../graphql/query/getCareOrdersByCareId';
import getCareOrdersByProviderId from '../../graphql/query/getCareOrdersByProviderId';
import getCareServiceDetailsByProviderId from '../../graphql/query/getCareServiceDetailsByProviderId';


//Get provider details

function* getProviderProfileById(action) {
    // const { userId } = action.payload;
    let data =
        { "id": action.payload.id }
    const graphqlResponse = yield call(query, getUserById, data);

    if (graphqlResponse.tblUserByUserId) {
        yield put(RequestActions.getProviderProfileByIdSuccess(graphqlResponse.tblUserByUserId))
    } else {
        yield put(RequestActions.getProviderProfileByIdFailed(graphqlResponse))
    }
}

function* getDelights(action) {
    // const { userId } = action.payload;
    const graphqlResponse = yield call(unAuthorizedQuery, getDelightsGql);
    console.log(graphqlResponse)
    if (graphqlResponse.allTblProducts) {
        yield put(RequestActions.getDelightsSuccess(graphqlResponse.allTblProducts))
    } else {
        yield put(RequestActions.getDelightsFailed(graphqlResponse))
    }
}

function* getDelightsById(action) {
    const graphqlResponse = yield call(unAuthorizedQuery, getDelightsByIdGql, action.payload);
    console.log(graphqlResponse)
    if (graphqlResponse.tblProductByProductId) {
        yield put(RequestActions.getDelightsByIdSuccess(graphqlResponse.tblProductByProductId))
    } else {
        yield put(RequestActions.getDelightsByIdFailed(graphqlResponse))
    }
}

//User Phone Registration
function* fetchRequests(action) {


    const graphqlResponse = yield call(mutation, getRequests, action.payload);
    console.log('GET REQUESTS RESPONSE', graphqlResponse);

    if (graphqlResponse.error) {
        yield put(RequestActions.getRequestsFailed())
    }
    else if (graphqlResponse.yocoFunGetNearbyRequests.json.Requests) {
        yield put(RequestActions.getRequestsSuccess(graphqlResponse.yocoFunGetNearbyRequests.json.Requests))
    } else {
        yield put(RequestActions.getRequestsFailed(graphqlResponse))
    }

}
//Get request detials
function* getRequestDetailsById(action) {


    const graphqlResponse = yield call(query, getRequestDetails, action.payload);

    if (graphqlResponse.tblRequestByRequestId.nodeId) {
        yield put(RequestActions.getRequestDetailsSuccess(graphqlResponse.tblRequestByRequestId))
    } else {
        yield put(RequestActions.getRequestDetailsFailed(graphqlResponse.tblRequestByRequestId))
    }

}




function* sendChatNotification(action) {
    const apiResponse = yield call(axiosPost, 'chatnotification', action.payload);
    console.log(apiResponse)
    if (apiResponse.error) {
        yield put(RequestActions.sendChatNotificationFailed(null))
    }
    else if (apiResponse) {
        yield put(RequestActions.sendChatNotificationSuccess(apiResponse))
    } else {
        yield put(RequestActions.sendChatNotificationFailed(null))
    }

}


function* sendQuote(action) {
    const apiResponse = yield call(axiosPost, 'provider/request', action.payload);

    if (apiResponse.error) {
        yield put(RequestActions.sendQuoteFailed(null))
    }
    else if (apiResponse.response && apiResponse.response.data) {
        yield put(RequestActions.sendQuoteSuccess(apiResponse.response.data.returnMessage))
    } else {
        console.log(apiResponse)
        yield put(RequestActions.sendQuoteFailed(null))
    }

}
function* setFilter(action) {
    const apiResponse = yield call(axiosPost, 'provider/request', action.payload);
    if (action.payload.filter) {
        yield put(RequestActions.setFilterSuccess(action.payload.filter))
    }
}

function* enableChat(action) {

    const apiResponse = yield call(axiosPost, 'request/chat', action.payload);
    console.log("heyy", apiResponse)
    if (apiResponse.response.data) {
        yield put(RequestActions.enableChatSuccess(apiResponse.response.data.returnMessage))
    } else {
        yield put(RequestActions.enableChatFailed(null))
    }

}


function* getChatData(action) {

    const graphqlResponse = yield call(query, getChatDataGql, action.payload);

    if (graphqlResponse.allTblChats.nodes && graphqlResponse.allTblChats.nodes.length > 0) {
        yield put(RequestActions.getChatSuccess(graphqlResponse.allTblChats.nodes[0]))
    } else {
        yield put(RequestActions.getChatFailed(null))
    }

}


//Get Service Details
function* getServiceDetails(action) {

    const graphqlResponse = yield call(query, getServiceDetailsGql, action.payload);

    if (graphqlResponse.allTblServiceOrders.nodes && graphqlResponse.allTblServiceOrders.nodes.length > 0) {
        yield put(RequestActions.getServiceDetailsSuccess(graphqlResponse.allTblServiceOrders.nodes[0]))
    } else {
        yield put(RequestActions.getServiceDetailsFailed(null))
    }

}

//Get Service Details
function* createNewOrder(action) {

    const apiResponse = yield call(axiosPost, 'order', action.payload);

    if (apiResponse.error) {
        yield put(RequestActions.createOrderFailed(null))
    }
    else if (apiResponse.response.data.returnCode === 200) {
        yield put(RequestActions.createOrderSuccess(apiResponse.response.data.returnMessage))
    } else {
        yield put(RequestActions.createOrderFailed(null))
    }
}

function* createNewCareOrder(action) {

    const apiResponse = yield call(axiosPost, 'care/new-order', action.payload);
    console.log('CREATE CARE ORDER', apiResponse);
    if (apiResponse.error) {
        yield put(RequestActions.createCareOrderFailed(null))
    }
    else if (apiResponse.response.data.returnCode === 200) {
        yield put(RequestActions.createCareOrderSuccess(apiResponse.response.data.returnMessage))
    } else {
        yield put(RequestActions.createCareOrderFailed(null))
    }
}

//Get Order Finish Detals
function* createOrderClaim(action) {

    const apiResponse = yield call(axiosPost, `order/claim/${action.payload.serviceOrderId}`, action.payload.body);
    console.log('RESPONSE', apiResponse)
    if (apiResponse.error) {
        yield put(RequestActions.addOrderClaimFailed(null))
    }
    else if (apiResponse.response.data.returnCode === 200) {
        yield put(RequestActions.addOrderClaimSuccess(apiResponse.response.data.returnMessage))
    } else {
        yield put(RequestActions.addOrderClaimFailed(null))
    }
}

//Get User Care Orders
function* getAllCareOrders(action) {

    const graphqlResponse = yield call(query, getCareOrdersByCareId, action.payload);
    if (graphqlResponse.error) {
        yield put(RequestActions.getAllCareOrdersFailed(null))
    }
    else if (graphqlResponse && graphqlResponse.allTblCareOrders && graphqlResponse.allTblCareOrders.nodes) {
        yield put(RequestActions.getAllCareOrdersSuccess(graphqlResponse.allTblCareOrders.nodes))
    } else {
        yield put(RequestActions.getAllCareOrdersFailed(null))
    }
}

//Get Provider Care Orders
function* getProviderCareOrders(action) {

    const graphqlResponse = yield call(query, getCareOrdersByProviderId, action.payload);
    if (graphqlResponse.error) {
        yield put(RequestActions.getProviderCareOrdersFailed(null))
    }
    else if (graphqlResponse && graphqlResponse.allTblCareOrders && graphqlResponse.allTblCareOrders.nodes) {
        yield put(RequestActions.getProviderCareOrdersSuccess(graphqlResponse.allTblCareOrders.nodes))
    } else {
        yield put(RequestActions.getProviderCareOrdersFailed(null))
    }
}

//Get Care Service Details
function* getCareServiceDetails(action) {

    const graphqlResponse = yield call(query, getCareServiceDetailsByProviderId, action.payload);
    console.log('CARE SERVICE DETAILS API', graphqlResponse);
    if (graphqlResponse.error) {
        yield put(RequestActions.getCareServiceDetailsFailed(null))
    }
    else if (graphqlResponse && graphqlResponse.allTblCareProviders && graphqlResponse.allTblCareProviders.nodes) {
        yield put(RequestActions.getCareServiceDetailsSuccess(graphqlResponse.allTblCareProviders.nodes))
    } else {
        yield put(RequestActions.getCareServiceDetailsFailed(null))
    }
}

//Get Orders
function* getProviderOrders(action) {

    const apiResponse = yield call(axiosGet, `providers/orders/${action.payload.provider_id}`);

    if (apiResponse.error) {
        yield put(RequestActions.getProviderOrdersFailed(null))
    }
    else if (apiResponse.response) {
        yield put(RequestActions.getProviderOrdersSuccess(apiResponse.response.data))
    }
}

//Get Provider Wallet
function* getProviderWallet(action) {

    const apiResponse = yield call(axiosGet, `provider/wallet/${action.payload.provider_id}`);
    console.log('API RESPONSE', apiResponse)
    if (apiResponse.error) {
        yield put(RequestActions.getProviderWalletFailed(null))
    }
    else if (apiResponse.response) {
        var myWallet = {
            advanceTotal: apiResponse.response.data && apiResponse.response.data.length > 0 ? apiResponse.response.data[0].AdvanceTotal && apiResponse.response.data[0].AdvanceTotal.length > 0 ? apiResponse.response.data[0].AdvanceTotal[0].advancetotal ? apiResponse.response.data[0].AdvanceTotal[0].advancetotal : 0.00 : 0 : 0,
            payableTotal: apiResponse.response.data && apiResponse.response.data.length > 0 ? apiResponse.response.data[1].PayableOnCompletion && apiResponse.response.data[1].PayableOnCompletion && apiResponse.response.data[1].PayableOnCompletion.length > 0 ? apiResponse.response.data[1].PayableOnCompletion[0].payabletotal ? apiResponse.response.data[1].PayableOnCompletion[0].payabletotal : 0.00 : 0 : 0,
            amountPaid: apiResponse.response.data && apiResponse.response.data.length > 0 ? apiResponse.response.data[2].AmountPaid && apiResponse.response.data[2].AmountPaid && apiResponse.response.data[2].AmountPaid.length > 0 ? apiResponse.response.data[2].AmountPaid[0].totalAmountPaid ? apiResponse.response.data[2].AmountPaid[0].totalAmountPaid : 0.00 : 0 : 0
        }
        myWallet.totalBalance = parseFloat(myWallet.advanceTotal) + parseFloat(myWallet.payableTotal)
        yield put(RequestActions.getProviderWalletSuccess(myWallet))
    }
}

//Get Service Details
function* getDigitalId(action) {

    const graphqlResponse = yield call(unAuthorizedQuery, getDigitalIdGql, action.payload);

    if (graphqlResponse.tblServiceOrderByServiceOrderId) {
        yield put(RequestActions.getDigitalIdSuccess(graphqlResponse.tblServiceOrderByServiceOrderId))
    } else {
        yield put(RequestActions.getDigitalIdFailed(null))
    }

}

//Get Provider Wallet
function* getOrderDetails(action) {

    const apiResponse = yield call(axiosGet, `orderdetails/${action.payload.serviceorderid}`);
    console.log('ORDER API RESPONSE', apiResponse)
    if (apiResponse.error) {
        yield put(RequestActions.getOrderDetailsFailed(null))
    }
    else if (apiResponse.response) {
        yield put(RequestActions.getOrderDetailsSuccess(apiResponse.response.data))
    }
}


//Get all Admin Request
function* getAllAdminUserRequest(action) {


    const graphqlResponse = yield call(mutation, getAdminAllRequests, action.payload);

    if (graphqlResponse.error) {
        yield put(RequestActions.getAllAdminUserRequestFailed())
    }
    else if (graphqlResponse.yocoFunGetAllRequest.json.Requests) {
        yield put(RequestActions.getAllAdminUserRequestSuccess(graphqlResponse.yocoFunGetAllRequest.json.Requests))
    } else {
        yield put(RequestActions.getAllAdminUserRequestFailed(graphqlResponse))
    }

}

export default function* ProviderSagas() {
    yield takeLatest(RequestActions.GET_PROVIDER_BY_ID, getProviderProfileById);
    yield takeLatest(RequestActions.GET_REQUESTS, fetchRequests);
    yield takeLatest(RequestActions.GET_DELIGHTS, getDelights);
    yield takeLatest(RequestActions.GET_DELIGHTS_BY_ID, getDelightsById);
    yield takeLatest(RequestActions.GET_REQUEST_DETAILS, getRequestDetailsById);
    yield takeLatest(RequestActions.SEND_QUOTE, sendQuote);
    yield takeLatest(RequestActions.SET_FILTER, setFilter);
    yield takeLatest(RequestActions.GET_SERVICE_DETAILS, getServiceDetails);
    yield takeLatest(RequestActions.ENABLE_CHAT, enableChat);
    yield takeLatest(RequestActions.GET_CHAT, getChatData);
    yield takeLatest(RequestActions.CREATE_ORDER, createNewOrder);
    yield takeLatest(RequestActions.CREATE_CARE_ORDER, createNewCareOrder);
    yield takeLatest(RequestActions.GET_PROVIDER_ORDERS, getProviderOrders);
    yield takeLatest(RequestActions.GET_PROVIDER_WALLET, getProviderWallet);
    yield takeLatest(RequestActions.GET_DIGITALID_INFO, getDigitalId);
    yield takeLatest(RequestActions.GET_ORDER_DETAILS, getOrderDetails);
    yield takeLatest(RequestActions.SEND_CHAT_NOTIFICATION, sendChatNotification);
    yield takeLatest(RequestActions.ADD_ORDER_CLAIM, createOrderClaim);
    yield takeLatest(RequestActions.GET_ALL_ADMIN_USER_REQUEST, getAllAdminUserRequest);
    yield takeLatest(RequestActions.GET_ALL_CARE_ORDERS, getAllCareOrders);
    yield takeLatest(RequestActions.GET_PROVIDER_CARE_ORDERS, getProviderCareOrders);
    yield takeLatest(RequestActions.GET_CARE_SERVICE_DETAILS, getCareServiceDetails);
}