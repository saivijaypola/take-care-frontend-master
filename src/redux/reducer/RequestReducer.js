import { RequestActions } from '../actions/index';

const initialState = {
    requests: null,
    providerDetails: null,
    isRequestLoading: false,
    requestDetails: '',
    isRequestDetailsLoading: false,
    isRequestUpdated: false,
    isRequestUpdating: false,
    serviceDetails: null,
    serviceId: '',
    delights: null,
    delight: null,
    chatData: null,
    isChatLoading: false,
    isChatCreated: false,
    chatId: '',
    showingList: 'All',
    isLoading: false,
    isChatFound: false,
    orderId: '',
    isOrderCreated: false,
    orders: [],
    isOrdersLoading: false,
    wallet: {
        advanceTotal: 0.00,
        payableTotal: 0.00,
        totalBalance: 0.00
    },
    isOrderStatusUpdated: false,
    failedToSendQuote: false,
    digitalId: '',
    isDigitalIdLoading: false,
    orderDetails: null,
    faliedToLoadOrderDetails: false,
    isChatNotificationSent: false,
    orderClaimId: null,
    isCareOrderCreated: false,
    careOrders: [],
    isCareOrdersLoading: false,
    providerCareOrders: [],
    isProviderCareOrdersLoading: false,
    careServiceDetails: [],
    isCareServiceDetailsLoading: false,
};

export default function (state = initialState, action) {
    switch (action.type) {

        case RequestActions.GET_DELIGHTS:
            return {
                ...state,
                delights: null,
                isLoading: true
            }
        case RequestActions.GET_DELIGHTS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                delights: action.payload
            }
        case RequestActions.GET_DELIGHTS_FAILED:
            return {
                ...state,
                isLoading: false,
            }
        case RequestActions.GET_DELIGHTS_BY_ID:
            return {
                ...state,
                delight: null,
                isLoading: true
            }
        case RequestActions.GET_DELIGHTS_BY_ID_SUCCESS:
            return {
                ...state,
                isLoading: false,
                delight: action.payload
            }
        case RequestActions.GET_DELIGHTS_BY_ID_FAILED:
            return {
                ...state,
                isLoading: false,
            }
        case RequestActions.SET_FILTER:
            return {
                ...state,
            }
        case RequestActions.SET_FILTER_SUCCESS:
            return {
                ...state,
                showingList: action.payload,
            }
        case RequestActions.GET_PROVIDER_BY_ID:
            return {
                ...state,
                providerDetails: null,
                isLoading: true
            }
        case RequestActions.GET_PROVIDER_BY_ID_SUCCESS:
            return {
                ...state,
                isLoading: false,
                providerDetails: action.payload
            }
        case RequestActions.GET_PROVIDER_BY_ID_FAILED:
            return {
                ...state,
                isLoading: false,
                isUserLoad: 2
            }
        case RequestActions.GET_REQUESTS:
            return {
                ...state,
                isRequestLoading: true,
                requests: []
            }
        case RequestActions.GET_REQUESTS_SUCCESS:
            return {
                ...state,
                requests: action.payload,
                isRequestLoading: false
            }
        case RequestActions.GET_REQUESTS_FAILED:
            return {
                ...state,
                requests: null,
                isRequestLoading: false
            }

        case RequestActions.GET_REQUEST_DETAILS:
            return {
                ...state,
                requestDetails: null,
                isRequestDetailsLoading: true,
            }
        case RequestActions.GET_REQUEST_DETAILS_SUCCESS:
            return {
                ...state,
                requestDetails: action.payload,
                isRequestDetailsLoading: false,
            }
        case RequestActions.GET_REQUEST_DETAILS_FAILED:
            return {
                ...state,
                requestDetails: null,
                isRequestDetailsLoading: false,
            }
        case RequestActions.SEND_QUOTE:
            return {
                ...state,
                isRequestUpdating: true,
                isRequestUpdated: false,
                failedToSendQuote: false
            }
        case RequestActions.SEND_QUOTE_SUCCESS:
            return {
                ...state,
                isRequestUpdated: true,
                serviceId: action.payload,
                isRequestUpdating: false,
                failedToSendQuote: false
            }
        case RequestActions.SEND_QUOTE_FAILED:
            return {
                ...state,
                isRequestUpdated: false,
                isRequestUpdating: false,
                failedToSendQuote: true
            }
        case RequestActions.GET_SERVICE_DETAILS:
            return {
                ...state,
                serviceId: '',
                serviceDetails: null
            }
        case RequestActions.GET_SERVICE_DETAILS_SUCCESS:
            return {
                ...state,
                serviceDetails: action.payload,
                serviceId: action.payload.serviceOrderId
            }
        case RequestActions.GET_SERVICE_DETAILS_FAILED:
            return {
                ...state,
                serviceDetails: null,
                serviceId: '',
            }
        case RequestActions.ENABLE_CHAT:
            return {
                ...state,
                chatData: null,
                chatId: ''
            }
        case RequestActions.ENABLE_CHAT_SUCCESS:
            return {
                ...state,
                chatId: action.payload,
                isChatLoading: false,
                isChatCreated: true
            }
        case RequestActions.ENABLE_CHAT_FAILED:
            return {
                ...state,
                isChatLoading: false,
                isChatCreated: false,
                chatId: ''
            }
        case RequestActions.GET_CHAT:
            return {
                ...state,
                isChatLoading: true,
                chatId: null,
                chatData: null
            }
        case RequestActions.GET_CHAT_SUCCESS:
            return {

                ...state,
                chatData: action.payload,
                chatId: action.payload.chatId,
                isChatLoading: false
            }
        case RequestActions.GET_CHAT_FAILED:
            return {
                ...state,
                chatData: null,
                isChatLoading: false
            }
        case RequestActions.CREATE_ORDER:
            return {
                ...state,
                isOrderCreated: false,
                orderId: ''
            }
        case RequestActions.CREATE_ORDER_SUCCESS:
            return {
                ...state,
                isOrderCreated: true,
                orderId: action.payload
            }
        case RequestActions.CREATE_ORDER_FAILED:
            return {
                ...state,
                isOrderCreated: false,
                orderId: null
            }
        case RequestActions.CREATE_CARE_ORDER:
            return {
                ...state,
                isCareOrderCreated: false,
                orderId: ''
            }
        case RequestActions.CREATE_CARE_ORDER_SUCCESS:
            return {
                ...state,
                isCareOrderCreated: true,
                orderId: action.payload
            }
        case RequestActions.CREATE_CARE_ORDER_FAILED:
            return {
                ...state,
                isCareOrderCreated: false,
                orderId: null
            }
        case RequestActions.RESET_REQUESTS:
            return {
                ...state,
                requests: []
            }
        case RequestActions.GET_PROVIDER_ORDERS:
            return {
                ...state,
                orders: [],
                isOrdersLoading: true
            }
        case RequestActions.GET_PROVIDER_ORDERS_SUCCESS:
            return {
                ...state,
                orders: action.payload,
                isOrdersLoading: false
            }
        case RequestActions.GET_PROVIDER_ORDERS_FAILED:
            return {
                ...state,
                orders: [],
                isOrdersLoading: false
            }
        case RequestActions.GET_PROVIDER_CARE_ORDERS:
            return {
                ...state,
                providerCareOrders: [],
                isProviderCareOrdersLoading: true
            }
        case RequestActions.GET_PROVIDER_CARE_ORDERS_SUCCESS:
            return {
                ...state,
                providerCareOrders: action.payload,
                isProviderCareOrdersLoading: false
            }
        case RequestActions.GET_PROVIDER_CARE_ORDERS_FAILED:
            return {
                ...state,
                providerCareOrders: [],
                isProviderCareOrdersLoading: false
            }
        case RequestActions.GET_PROVIDER_WALLET:
            return {
                ...state,
                wallet: {
                    advanceTotal: 0.00,
                    payableTotal: 0.00,
                    totalBalance: 0.00
                },
            }
        case RequestActions.GET_PROVIDER_WALLET_SUCCESS:
            return {
                ...state,
                wallet: action.payload,
                isLoading: false
            }
        case RequestActions.GET_PROVIDER_WALLET_FAILED:
            return {
                ...state,
                wallet: {
                    advanceTotal: 0.00,
                    payableTotal: 0.00,
                    totalBalance: 0.00
                }
            }
        case RequestActions.GET_DIGITALID_INFO:
            return {
                ...state,
                isDigitalIdLoading: true

            }
        case RequestActions.GET_DIGITALID_INFO_SUCCESS:
            return {
                ...state,
                digitalId: action.payload,
                isDigitalIdLoading: false
            }
        case RequestActions.GET_DIGITALID_INFO_FAILED:
            return {
                ...state,
                isDigitalIdLoading: false,
                digitalId: null
            }
        case RequestActions.GET_ORDER_DETAILS:
            return {
                ...state,
                faliedToLoadOrderDetails: false
            }
        case RequestActions.GET_ORDER_DETAILS_SUCCESS:
            return {
                ...state,
                orderDetails: action.payload,
                faliedToLoadOrderDetails: false
            }
        case RequestActions.GET_ORDER_DETAILS_FAILED:
            return {
                ...state,
                orderDetails: null,
                faliedToLoadOrderDetails: true
            }
        case RequestActions.SEND_CHAT_NOTIFICATION:
            return {
                ...state,
                isChatNotificationSent: false
            }
        case RequestActions.SEND_CHAT_NOTIFICATION_SUCCESS:
            return {
                ...state,
                isChatNotificationSent: true
            }
        case RequestActions.SEND_CHAT_NOTIFICATION_FAILED:
            return {
                ...state,
                isChatNotificationSent: false
            }
        case RequestActions.ORDER_FINISH_DETAILS:
            return {
                ...state,
                orderClaimId: null
            }
        case RequestActions.ORDER_FINISH_DETAILS_SUCCESS:
            return {
                ...state,
                orderClaimId: action.payload
            }
        case RequestActions.ORDER_FINISH_DETAILS_FAILED:
            return {
                ...state,
                orderClaimId: '0'
            }

        case RequestActions.GET_ALL_CARE_ORDERS:
            return {
                ...state,
                isCareOrdersLoading: true,
                careOrders: []
            }
        case RequestActions.GET_ALL_CARE_ORDERS_SUCCESS:
            return {
                ...state,
                careOrders: action.payload,
                isCareOrdersLoading: false
            }
        case RequestActions.GET_ALL_CARE_ORDERS_FAILED:
            return {
                ...state,
                careOrders: [],
                isCareOrdersLoading: false
            }
        case RequestActions.GET_CARE_SERVICE_DETAILS:
            return {
                ...state,
                careServiceDetails: [],
                isCareServiceDetailsLoading: true
            }
        case RequestActions.GET_CARE_SERVICE_DETAILS_SUCCESS:
            return {
                ...state,
                careServiceDetails: action.payload,
                isCareServiceDetailsLoading: false
            }
        case RequestActions.GET_CARE_SERVICE_DETAILS_FAILED:
            return {
                ...state,
                careServiceDetails: [],
                isCareServiceDetailsLoading: false
            }

        //Admin User Request
        case RequestActions.GET_ALL_ADMIN_USER_REQUEST:
            return {
                ...state,
                isRequestLoading: true,
                requests: []
            }
        case RequestActions.GET_ALL_ADMIN_USER_REQUEST_SUCCESS:
            return {
                ...state,
                requests: action.payload,
                isRequestLoading: false
            }
        case RequestActions.GET_ALL_ADMIN_USER_REQUEST_FAILED:
            return {
                ...state,
                requests: null,
                isRequestLoading: false
            }
        default:
            return {
                ...state
            }
    }
}
