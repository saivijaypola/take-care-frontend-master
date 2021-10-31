import { createAction } from 'redux-actions';


export const ADD_REACTION = "ADD_REACTION"
export const addReaction = createAction(ADD_REACTION);

export const ADD_REACTION_SUCCESS = "ADD_REACTION_SUCCESS"
export const addReactionSuccess = createAction(ADD_REACTION_SUCCESS);

export const ADD_REACTION_FAILED = "ADD_REACTION_FAILED"
export const addReactionFailed = createAction(ADD_REACTION_FAILED);


export const REJECT_OFFER = "REJECT_OFFER"
export const rejectOffer = createAction(REJECT_OFFER);

export const REJECT_OFFER_SUCCESS = "REJECT_OFFER_SUCCESS"
export const rejectOfferSuccess = createAction(REJECT_OFFER_SUCCESS);

export const REJECT_OFFER_FAILED = "REJECT_OFFER_FAILED"
export const rejectOfferFailed = createAction(REJECT_OFFER_FAILED);

export const UPDATE_FILTERS = "UPDATE_FILTERS"
export const updateFilters = createAction(UPDATE_FILTERS);

export const RESET_PROVIDERS = "RESET_PROVIDERS"
export const resetProviders = createAction(RESET_PROVIDERS);

export const INITIATE_CHAT = "INITIATE_CHAT"
export const initiateChat = createAction(INITIATE_CHAT);


//Post new request 
export const POST_NEW_REQUEST = "POST_NEW_REQUEST"
export const postNewRequest = createAction(POST_NEW_REQUEST);

export const POST_NEW_REQUEST_SUCCESS = "POST_NEW_REQUEST_SUCCESS"
export const postNewRequestSuccess = createAction(POST_NEW_REQUEST_SUCCESS);

export const POST_NEW_REQUEST_FAILED = "POST_NEW_REQUEST_FAILED"
export const postNewRequestFailed = createAction(POST_NEW_REQUEST_FAILED);

export const CREATE_SERVICE_ORDER = "CREATE_SERVICE_ORDER"
export const createServiceOrder = createAction(CREATE_SERVICE_ORDER);

export const CREATE_SERVICE_ORDER_SUCCESS = "CREATE_SERVICE_ORDER_SUCCESS"
export const createServiceOrderSuccess = createAction(CREATE_SERVICE_ORDER_SUCCESS);

export const CREATE_SERVICE_ORDER_FAILED = "CREATE_SERVICE_ORDER_FAILED"
export const createServiceOrderFailed = createAction(CREATE_SERVICE_ORDER_FAILED);


//Post new request 
export const UPDATE_REQUEST = "UPDATE_REQUEST"
export const updateRequest = createAction(UPDATE_REQUEST);

export const UPDATE_REQUEST_SUCCESS = "UPDATE_REQUEST_SUCCESS"
export const updateRequestSuccess = createAction(UPDATE_REQUEST_SUCCESS);

export const UPDATE_REQUEST_FAILED = "UPDATE_REQUEST_FAILED"
export const updateRequestFailed = createAction(UPDATE_REQUEST_FAILED);

//Update request status
export const UPDATE_REQUEST_STATUS = "UPDATE_REQUEST_STATUS"
export const updateRequestStatus = createAction(UPDATE_REQUEST_STATUS);

export const UPDATE_REQUEST__STATUS_SUCCESS = "UPDATE_REQUEST__STATUS_SUCCESS"
export const updateRequestStatusSuccess = createAction(UPDATE_REQUEST__STATUS_SUCCESS);

export const UPDATE_REQUEST_STATUS_FAILED = "UPDATE_REQUEST_STATUS_FAILED"
export const updateRequestStatusFailed = createAction(UPDATE_REQUEST_STATUS_FAILED);


//Get all requests by user 
export const GET_ALL_REQUESTS = "GET_ALL_REQUESTS"
export const getAllRequests = createAction(GET_ALL_REQUESTS);

export const GET_ALL_REQUESTS_SUCCESS = "GET_ALL_REQUESTS_SUCCESS"
export const getAllRequestsSuccess = createAction(GET_ALL_REQUESTS_SUCCESS);

export const GET_ALL_REQUESTS_FAILED = "GET_ALL_REQUESTS_FAILED"
export const getAllRequestsFailed = createAction(GET_ALL_REQUESTS_FAILED);


//Get Confirmed Requests
export const GET_CONFIRMED_REQUESTS = "GET_CONFIRMED_REQUESTS"
export const getConfirmedRequests = createAction(GET_CONFIRMED_REQUESTS);

export const GET_CONFIRMED_REQUESTS_SUCCESS = "GET_CONFIRMED_REQUESTS_SUCCESS"
export const getConfirmedRequestsSuccess = createAction(GET_CONFIRMED_REQUESTS_SUCCESS);

export const GET_CONFIRMED_REQUESTS_FAILED = "GET_CONFIRMED_REQUESTS_FAILED"
export const getConfirmedRequestsFailed = createAction(GET_CONFIRMED_REQUESTS_FAILED);


//Make a selection

export const SELECT_POST = "SELECT_POST"
export const selectPost = createAction(SELECT_POST);

//get nearby and responded providers

export const GET_PROVIDERS = "GET_PROVIDERS"
export const getProviders = createAction(GET_PROVIDERS);

export const GET_PROVIDERS_SUCCESS = "GET_PROVIDERS_SUCCESS"
export const getProvidersSuccess = createAction(GET_PROVIDERS_SUCCESS);

export const GET_PROVIDERS_FAILED = "GET_PROVIDERS_FAILED"
export const getProvidersFailed = createAction(GET_PROVIDERS_FAILED);



//Get nearby providers
export const GET_NEARBY_PROVIDERS = "GET_NEARBY_PROVIDERS"
export const getNearByProviders = createAction(GET_NEARBY_PROVIDERS);

export const GET_NEARBY_PROVIDERS_SUCCESS = "GET_NEARBY_PROVIDERS_SUCCESS"
export const getNearByProvidersSuccess = createAction(GET_NEARBY_PROVIDERS_SUCCESS);

export const GET_NEARBY_PROVIDERS_FAILED = "GET_NEARBY_PROVIDERS_FAILED"
export const getNearByProvidersFailed = createAction(GET_NEARBY_PROVIDERS_FAILED);

export const GET_RESPONDS_PROVIDER = "GET_RESPONDS_PROVIDER"
export const getRespondsFromProvider = createAction(GET_RESPONDS_PROVIDER);

export const GET_RESPONDS_PROVIDER_SUCCESS = "GET_RESPONDS_PROVIDER_SUCCESS"
export const getRespondsFromProviderSuccess = createAction(GET_RESPONDS_PROVIDER_SUCCESS);

export const GET_RESPONDS_PROVIDER_FAILED = "GET_RESPONDS_PROVIDER_FAILED"
export const getRespondsFromProviderFailed = createAction(GET_RESPONDS_PROVIDER_FAILED);


//Order Claim after Complete
export const GET_ORDER_CLAIMS_BY_ORDER_ID = "GET_ORDER_CLAIMS_BY_ORDER_ID"
export const getOrderClaimsByOrder = createAction(GET_ORDER_CLAIMS_BY_ORDER_ID);

export const GET_ORDER_CLAIMS_BY_ORDER_ID_SUCCESS = "GET_ORDER_CLAIMS_BY_ORDER_ID_SUCCESS"
export const getOrderClaimsByOrderSuccess = createAction(GET_ORDER_CLAIMS_BY_ORDER_ID_SUCCESS);

export const GET_ORDER_CLAIMS_BY_ORDER_ID_FAILED = "GET_ORDER_CLAIMS_BY_ORDER_ID_FAILED"
export const getOrderClaimsByOrderFailed = createAction(GET_ORDER_CLAIMS_BY_ORDER_ID_FAILED);



export const SET_ACTIVE_FILTER_MESSAGE = "SET_ACTIVE_FILTER_MESSAGE"
export const setActiveFilterMessage = createAction(SET_ACTIVE_FILTER_MESSAGE);

export const SET_MTP_OPTED = "SET_MTP_OPTED"
export const setMtpOpted = createAction(SET_MTP_OPTED);

export const UPDATE_MTP_STATUS = "UPDATE_MTP_STATUS"
export const updateMtpStatus = createAction(UPDATE_MTP_STATUS);

export const UPDATE_MTP_STATUS_SUCCESS = "UPDATE_MTP_STATUS_SUCCESS"
export const updateMtpStatusSuccess = createAction(UPDATE_MTP_STATUS_SUCCESS);

export const UPDATE_MTP_STATUS_FAILED = "UPDATE_MTP_STATUS_FAILED"
export const updateMtpStatusFailed = createAction(UPDATE_MTP_STATUS_FAILED);

export const SET_EDIT_REQUEST = "SET_EDIT_REQUEST"
export const setEditRequest = createAction(SET_EDIT_REQUEST);