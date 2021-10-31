import { UserActions } from '../actions/index';


const initialState = {

    isPosted: false,
    isServiceOrderCreated: false,
    isRequestUpdated: false,
    isLoading: false,
    allPosts: [],
    selectedPost: localStorage.getItem('selectedPost') !== null ? JSON.parse(localStorage.getItem('selectedPost')) : '',
    postResponse: '',
    nearByProviders: null,
    providers: null,
    responds: [],
    allConfirmedRequests: [],
    orderClaims: [],
    listFilter: localStorage.getItem('filter') !== null ? JSON.parse(localStorage.getItem('filter')) : {
        filterBy: "quotesOnly",
        spiffyMin: 1,
        spiffyMax: 5,
        profilePic: true,
        showFull: false,
        isStrict: false,
        likeValue: "",
    },
    activeFilterMessage: 'Filter by offers',
    mtpOpted: null,
    mtpPaymentSuccess: null,
    editRequest: false,
    isStatusUpdated: null
};


export default function (state = initialState, action) {
    switch (action.type) {

        case UserActions.UPDATE_FILTERS:
            console.log(action.payload)
            localStorage.setItem('filter', JSON.stringify(action.payload))
            return {
                ...state,
                listFilter: JSON.parse(localStorage.getItem('filter')),
            }
        case UserActions.SET_ACTIVE_FILTER_MESSAGE:
            return {
                ...state,
                activeFilterMessage: action.payload
            }
        case UserActions.INITIATE_CHAT:
            return {
                ...state,
            }
        case UserActions.RESET_PROVIDERS:
            return {
                ...state,
                nearByProviders: null,
            }
        case UserActions.CREATE_SERVICE_ORDER:
            return {
                ...state,
                isLoading: true,
                isServiceOrderCreated: false,
            }
        case UserActions.CREATE_SERVICE_ORDER_SUCCESS:
            return {
                ...state,
                isServiceOrderCreated: true,
                isLoading: false,
            }
        case UserActions.CREATE_SERVICE_ORDER_FAILED:
            return {
                ...state,
                isLoading: false,
                isServiceOrderCreated: false
            }
        case UserActions.POST_NEW_REQUEST:
            return {
                ...state,
                isLoading: true,
                isPosted: false,
                selectedPost: null
            }
        case UserActions.POST_NEW_REQUEST_SUCCESS:
            return {
                ...state,
                isPosted: true,
                isLoading: false,
                selectedPost: action.payload,
                allPosts: [action.payload, ...state.allPosts]
            }
        case UserActions.POST_NEW_REQUEST_FAILED:
            return {
                ...state,
                isLoading: false,
                isPosted: false
            }
        case UserActions.UPDATE_REQUEST:
            return {
                ...state,
                isLoading: true,
                isRequestUpdated: false,
                isPosted: false,
                selectedPost: null
            }
        case UserActions.UPDATE_REQUEST_SUCCESS:
            return {
                ...state,
                isRequestUpdated: true,
                isLoading: false,
                isPosted: true,
                selectedPost: action.payload,
                allPosts: [action.payload, ...state.allPosts]
            }
        case UserActions.UPDATE_REQUEST_FAILED:
            return {
                ...state,
                isLoading: false,
                isPosted: false,
                isRequestUpdated: false
            }
            case UserActions.UPDATE_REQUEST_STATUS:
            return {
                ...state,
                isLoading: true,
                isStatusUpdated: false,
            }
        case UserActions.UPDATE_REQUEST__STATUS_SUCCESS:
            return {
                ...state,
                isStatusUpdated: true,
                isLoading: false,
            }
        case UserActions.UPDATE_REQUEST_STATUS_FAILED:
            return {
                ...state,
                isLoading: false,
                isStatusUpdated: false
            }
        case UserActions.GET_ALL_REQUESTS:
            return {
                ...state,
                allPosts: [],
                isLoading: true

            }
        case UserActions.GET_ALL_REQUESTS_SUCCESS:
            return {
                ...state,
                allPosts: action.payload,
                isLoading: false
            }
        case UserActions.GET_ALL_REQUESTS_FAILED:
            return {
                ...state,
                allPosts: [],
                isLoading: false
            }
        case UserActions.GET_CONFIRMED_REQUESTS:
            return {
                ...state,
                allPosts: [],
                allConfirmedRequests: [],
                isLoading: true
            }
        case UserActions.GET_CONFIRMED_REQUESTS_SUCCESS:
            return {
                ...state,
                allConfirmedRequests: action.payload,
                isLoading: false
            }
        case UserActions.GET_CONFIRMED_REQUESTS_FAILED:
            return {
                ...state,
                allConfirmedRequests: [],
                isLoading: false
            }
        case UserActions.SELECT_POST:
            var post = action.payload
            post.isActive = true
            localStorage.setItem('selectedPost', JSON.stringify(post))
            return {
                ...state,
                selectedPost: post ? post : localStorage.getItem('selectedPost'),
                isLoading: false
            }
        case UserActions.GET_PROVIDERS:
            return {
                ...state,
                isLoading: true,
                providers: null
            }
        case UserActions.GET_PROVIDERS_SUCCESS:
            return {
                ...state,
                providers: action.payload,
                isLoading: false
            }
        case UserActions.GET_PROVIDERS_FAILED:
            return {
                ...state,
                providers: [],
                isLoading: false
            }
        case UserActions.GET_NEARBY_PROVIDERS:
            return {
                ...state,
                isLoading: true,
                providers: null
            }
        case UserActions.GET_NEARBY_PROVIDERS_SUCCESS:
            return {
                ...state,
                providers: action.payload,
                isLoading: false
            }
        case UserActions.GET_NEARBY_PROVIDERS_FAILED:
            return {
                ...state,
                providers: [],
                isLoading: false
            }
        case UserActions.GET_RESPONDS_PROVIDER:
            return {
                ...state,
                responds: [],
                isLoading: true,
                nearByProviders: null
            }
        case UserActions.GET_RESPONDS_PROVIDER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                nearByProviders: action.payload
            }
        case UserActions.GET_RESPONDS_PROVIDER_FAILED:
            return {
                ...state,
                isLoading: false,
                nearByProviders: []
            }

        case UserActions.GET_ORDER_CLAIMS_BY_ORDER_ID:
            return {
                ...state,
                isLoading: true,
                orderClaims: []
            }
        case UserActions.GET_ORDER_CLAIMS_BY_ORDER_ID_SUCCESS:
            return {
                ...state,
                isLoading: false,
                orderClaims: action.payload
            }
        case UserActions.GET_ORDER_CLAIMS_BY_ORDER_ID_FAILED:
            return {
                ...state,
                isLoading: false,
                orderClaims: []
            }
        case UserActions.SET_MTP_OPTED:
            return {
                ...state,
                mtpOpted: action.payload
            }
        case UserActions.UPDATE_MTP_STATUS:
            return {
                ...state,
                isLoading: true,
            }
        case UserActions.UPDATE_MTP_STATUS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                mtpPaymentSuccess: true
            }
        case UserActions.UPDATE_MTP_STATUS_FAILED:
            return {
                ...state,
                isLoading: false,
                mtpPaymentSuccess: false
            }
        case UserActions.SET_EDIT_REQUEST:
            return {
                ...state,
                editRequest: action.payload
            }
        default:
            return {
                ...state
            }
    }
}