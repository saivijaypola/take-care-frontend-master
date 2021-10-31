import { createAction } from 'redux-actions';


export const GET_DELIGHTS = "GET_DELIGHTS"
export const getDelights = createAction(GET_DELIGHTS);

export const GET_DELIGHTS_SUCCESS = "GET_DELIGHTS_SUCCESS"
export const getDelightsSuccess = createAction(GET_DELIGHTS_SUCCESS);

export const GET_DELIGHTS_FAILED = "GET_DELIGHTS_FAILED"
export const getDelightsFailed = createAction(GET_DELIGHTS_FAILED);


export const GET_DELIGHTS_BY_ID = "GET_DELIGHTS_BY_ID"
export const getDelightsById = createAction(GET_DELIGHTS_BY_ID);

export const GET_DELIGHTS_BY_ID_SUCCESS = "GET_DELIGHTS_BY_ID_SUCCESS"
export const getDelightsByIdSuccess = createAction(GET_DELIGHTS_BY_ID_SUCCESS);

export const GET_DELIGHTS_BY_ID_FAILED = "GET_DELIGHTS_BY_ID_FAILED"
export const getDelightsByIdFailed = createAction(GET_DELIGHTS_BY_ID_FAILED);


//Get Invitation 
export const SET_FILTER = "SET_FILTER"
export const setFilter = createAction(SET_FILTER);

export const SET_FILTER_SUCCESS = "SET_FILTER_SUCCESS"
export const setFilterSuccess = createAction(SET_FILTER_SUCCESS);

export const GET_REQUESTS = "GET_REQUESTS"
export const getRequests = createAction(GET_REQUESTS);

export const GET_REQUESTS_SUCCESS = "GET_REQUESTS_SUCCESS"
export const getRequestsSuccess = createAction(GET_REQUESTS_SUCCESS);

export const GET_REQUESTS_FAILED = "GET_REQUESTS_FAILED"
export const getRequestsFailed = createAction(GET_REQUESTS_FAILED);


export const GET_REQUEST_DETAILS = "GET_REQUEST_DETAILS"
export const getRequestDetails = createAction(GET_REQUEST_DETAILS);

export const GET_REQUEST_DETAILS_SUCCESS = "GET_REQUEST_DETAILS_SUCCESS"
export const getRequestDetailsSuccess = createAction(GET_REQUEST_DETAILS_SUCCESS);

export const GET_REQUEST_DETAILS_FAILED = "GET_REQUEST_DETAILS_FAILED"
export const getRequestDetailsFailed = createAction(GET_REQUEST_DETAILS_FAILED);



export const SEND_QUOTE = "SEND_QUOTE"
export const sendQuote = createAction(SEND_QUOTE);

export const SEND_QUOTE_SUCCESS = "SEND_QUOTE_SUCCESS"
export const sendQuoteSuccess = createAction(SEND_QUOTE_SUCCESS);

export const SEND_QUOTE_FAILED = "SEND_QUOTE_FAILED"
export const sendQuoteFailed = createAction(SEND_QUOTE_FAILED);


// Get Provider details

export const GET_PROVIDER_BY_ID = "GET_PROVIDER_BY_ID"
export const getProviderProfileById = createAction(GET_PROVIDER_BY_ID);

export const GET_PROVIDER_BY_ID_SUCCESS = "GET_PROVIDER_BY_ID_SUCCESS"
export const getProviderProfileByIdSuccess = createAction(GET_PROVIDER_BY_ID_SUCCESS);

export const GET_PROVIDER_BY_ID_FAILED = "GET_PROVIDER_BY_ID_FAILED"
export const getProviderProfileByIdFailed = createAction(GET_PROVIDER_BY_ID_FAILED);


//Get Service Details
export const GET_SERVICE_DETAILS = "GET_SERVICE_DETAILS"
export const getServiceDetails = createAction(GET_SERVICE_DETAILS);

export const GET_SERVICE_DETAILS_SUCCESS = "GET_SERVICE_DETAILS_SUCCESS"
export const getServiceDetailsSuccess = createAction(GET_SERVICE_DETAILS_SUCCESS);

export const GET_SERVICE_DETAILS_FAILED = "UPDATE_REQUEST_FAILED"
export const getServiceDetailsFailed = createAction(GET_SERVICE_DETAILS_FAILED);


export const ENABLE_CHAT = "ENABLE_CHAT"
export const enableChat = createAction(ENABLE_CHAT);

export const ENABLE_CHAT_SUCCESS = "ENABLE_CHAT_SUCCESS"
export const enableChatSuccess = createAction(ENABLE_CHAT_SUCCESS);

export const ENABLE_CHAT_FAILED = "ENABLE_CHAT_FAILED"
export const enableChatFailed = createAction(ENABLE_CHAT_FAILED);


export const GET_CHAT = "GET_CHAT"
export const getChat = createAction(GET_CHAT);

export const GET_CHAT_SUCCESS = "GET_CHAT_SUCCESS"
export const getChatSuccess = createAction(GET_CHAT_SUCCESS);

export const GET_CHAT_FAILED = "GET_CHAT_FAILED"
export const getChatFailed = createAction(GET_CHAT_FAILED);



export const CREATE_ORDER = "CREATE_ORDER"
export const createOrder = createAction(CREATE_ORDER);

export const CREATE_ORDER_SUCCESS = "CREATE_ORDER_SUCCESS"
export const createOrderSuccess = createAction(CREATE_ORDER_SUCCESS);

export const CREATE_ORDER_FAILED = "CREATE_ORDER_FAILED"
export const createOrderFailed = createAction(CREATE_ORDER_FAILED);

export const CREATE_CARE_ORDER = "CREATE_CARE_ORDER"
export const createCareOrder = createAction(CREATE_CARE_ORDER);

export const CREATE_CARE_ORDER_SUCCESS = "CREATE_CARE_ORDER_SUCCESS"
export const createCareOrderSuccess = createAction(CREATE_CARE_ORDER_SUCCESS);

export const CREATE_CARE_ORDER_FAILED = "CREATE_CARE_ORDER_FAILED"
export const createCareOrderFailed = createAction(CREATE_CARE_ORDER_FAILED);

export const RESET_REQUESTS = "RESET_REQUESTS"
export const resetRequests = createAction(RESET_REQUESTS);


export const GET_PROVIDER_ORDERS = "GET_PROVIDER_ORDERS"
export const getProviderOrders = createAction(GET_PROVIDER_ORDERS);

export const GET_PROVIDER_ORDERS_SUCCESS = "GET_PROVIDER_ORDERS_SUCCESS"
export const getProviderOrdersSuccess = createAction(GET_PROVIDER_ORDERS_SUCCESS);

export const GET_PROVIDER_ORDERS_FAILED = "GET_PROVIDER_ORDERS_FAILED"
export const getProviderOrdersFailed = createAction(GET_PROVIDER_ORDERS_FAILED);


export const GET_PROVIDER_WALLET = "GET_PROVIDER_WALLET"
export const getProviderWallet = createAction(GET_PROVIDER_WALLET);

export const GET_PROVIDER_WALLET_SUCCESS = "GET_PROVIDER_WALLET_SUCCESS"
export const getProviderWalletSuccess = createAction(GET_PROVIDER_WALLET_SUCCESS);

export const GET_PROVIDER_WALLET_FAILED = "GET_PROVIDER_WALLET_FAILED"
export const getProviderWalletFailed = createAction(GET_PROVIDER_WALLET_FAILED);

export const UPDATE_ORDER_STATUS = "UPDATE_ORDER_STATUS"
export const updateOrderStatus = createAction(UPDATE_ORDER_STATUS);

export const UPDATE_ORDER_STATUS_SUCCESS = "UPDATE_ORDER_STATUS_SUCCESS"
export const updateOrderStatusSuccess = createAction(UPDATE_ORDER_STATUS_SUCCESS);

export const UPDATE_ORDER_STATUS_FAILED = "UPDATE_ORDER_STATUS_FAILED"
export const updateOrderStatusFailed = createAction(UPDATE_ORDER_STATUS_FAILED);


export const GET_DIGITALID_INFO = "GET_DIGITALID_INFO"
export const getDigitalId = createAction(GET_DIGITALID_INFO);

export const GET_DIGITALID_INFO_SUCCESS = "GET_DIGITALID_INFO_SUCCESS"
export const getDigitalIdSuccess = createAction(GET_DIGITALID_INFO_SUCCESS);

export const GET_DIGITALID_INFO_FAILED = "GET_DIGITALID_INFO_FAILED"
export const getDigitalIdFailed = createAction(GET_DIGITALID_INFO_FAILED);


export const GET_ORDER_DETAILS = "GET_ORDER_DETAILS"
export const getOrderDetails = createAction(GET_ORDER_DETAILS);

export const GET_ORDER_DETAILS_SUCCESS = "GET_ORDER_DETAILS_SUCCESS"
export const getOrderDetailsSuccess = createAction(GET_ORDER_DETAILS_SUCCESS);

export const GET_ORDER_DETAILS_FAILED = "GET_ORDER_DETAILS_FAILED"
export const getOrderDetailsFailed = createAction(GET_ORDER_DETAILS_FAILED);



export const SEND_CHAT_NOTIFICATION = "SEND_CHAT_NOTIFICATION"
export const sendChatNotification = createAction(SEND_CHAT_NOTIFICATION);

export const SEND_CHAT_NOTIFICATION_SUCCESS = "SEND_CHAT_NOTIFICATION_SUCCESS"
export const sendChatNotificationSuccess = createAction(SEND_CHAT_NOTIFICATION_SUCCESS);

export const SEND_CHAT_NOTIFICATION_FAILED = "SEND_CHAT_NOTIFICATION_FAILED"
export const sendChatNotificationFailed = createAction(SEND_CHAT_NOTIFICATION_FAILED);


export const ADD_ORDER_CLAIM = "ADD_ORDER_CLAIM"
export const addOrderClaim = createAction(ADD_ORDER_CLAIM);

export const ADD_ORDER_CLAIM_SUCCESS = "ADD_ORDER_CLAIM_SUCCESS"
export const addOrderClaimSuccess = createAction(ADD_ORDER_CLAIM_SUCCESS);

export const ADD_ORDER_CLAIM_FAILED = "ADD_ORDER_CLAIM_FAILED"
export const addOrderClaimFailed = createAction(ADD_ORDER_CLAIM_FAILED);




export const GET_ALL_ADMIN_USER_REQUEST = "GET_ALL_ADMIN_USER_REQUEST"
export const getAllAdminUserRequest = createAction(GET_ALL_ADMIN_USER_REQUEST);

export const GET_ALL_ADMIN_USER_REQUEST_SUCCESS = "GET_ALL_ADMIN_USER_REQUEST_SUCCESS"
export const getAllAdminUserRequestSuccess = createAction(GET_ALL_ADMIN_USER_REQUEST_SUCCESS);

export const GET_ALL_ADMIN_USER_REQUEST_FAILED = "GET_ALL_ADMIN_USER_REQUEST_FAILED"
export const getAllAdminUserRequestFailed = createAction(GET_ALL_ADMIN_USER_REQUEST_FAILED);

export const GET_ALL_CARE_ORDERS = "GET_ALL_CARE_ORDERS"
export const getAllCareOrders = createAction(GET_ALL_CARE_ORDERS);

export const GET_ALL_CARE_ORDERS_SUCCESS = "GET_ALL_CARE_ORDERS_SUCCESS"
export const getAllCareOrdersSuccess = createAction(GET_ALL_CARE_ORDERS_SUCCESS);

export const GET_ALL_CARE_ORDERS_FAILED = "GET_ALL_CARE_ORDERS_FAILED"
export const getAllCareOrdersFailed = createAction(GET_ALL_CARE_ORDERS_FAILED);

export const GET_PROVIDER_CARE_ORDERS = "GET_PROVIDER_CARE_ORDERS"
export const getProviderCareOrders = createAction(GET_PROVIDER_CARE_ORDERS);

export const GET_PROVIDER_CARE_ORDERS_SUCCESS = "GET_PROVIDER_CARE_ORDERS_SUCCESS"
export const getProviderCareOrdersSuccess = createAction(GET_PROVIDER_CARE_ORDERS_SUCCESS);

export const GET_PROVIDER_CARE_ORDERS_FAILED = "GET_PROVIDER_CARE_ORDERS_FAILED"
export const getProviderCareOrdersFailed = createAction(GET_PROVIDER_CARE_ORDERS_FAILED);

export const GET_CARE_SERVICE_DETAILS = "GET_CARE_SERVICE_DETAILS"
export const getCareServiceDetails = createAction(GET_CARE_SERVICE_DETAILS);

export const GET_CARE_SERVICE_DETAILS_SUCCESS = "GET_CARE_SERVICE_DETAILS_SUCCESS"
export const getCareServiceDetailsSuccess = createAction(GET_CARE_SERVICE_DETAILS_SUCCESS);

export const GET_CARE_SERVICE_DETAILS_FAILED = "GET_CARE_SERVICE_DETAILS_FAILED"
export const getCareServiceDetailsFailed = createAction(GET_CARE_SERVICE_DETAILS_FAILED);