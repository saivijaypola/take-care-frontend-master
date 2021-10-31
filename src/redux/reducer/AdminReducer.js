import { AdminActions } from '../actions/index';

const initialState = {


    isLoading: false,
    providerList: [],
    allResponds: [],
    activeChats: [],
    failedToAddPackage: null,
    newPackageDetails: '',
    failedToAddProvider: null,
    newProviderDetails: '',
    failedToAddOtherPricing: null,
    otherPricingDetails: '',
    carePackageDetails: [],
    wildCardProviders: [],
    careRequestDetails: [],
    isPricingUpdated: false,
    failedToUpdatePricing: false,
    isStatusUpdated: false,
    failedToUpdateStatus: false,
    careDetailsSuccess: false,
    buttonClicked: null,
    titleUpdated: null,
    descUpdated: null
};


export default function (state = initialState, action) {
    switch (action.type) {

        //User Phone Registration 

        case AdminActions.GET_ALL_PROVIDERS:
            return {
                ...state,
                isLoading: true,
                providerList: []
            }
        case AdminActions.GET_ALL_PROVIDERS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                providerList: action.payload.Providers


            }
        case AdminActions.GET_ALL_PROVIDERS_FAIL:
            return {
                ...state,
                isLoading: false,
                providerList: []

            }
        case AdminActions.GET_ALL_RESPONDS:
            return {
                ...state,
                isLoading: true,
                allResponds: []
            }
        case AdminActions.GET_ALL_RESPONDS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                allResponds: action.payload


            }
        case AdminActions.GET_ALL_RESPONDS_FAIL:
            return {
                ...state,
                isLoading: false,
                allResponds: []

            }
        case AdminActions.GET_ACTIVE_CHAT_RESPONSE:
            return {
                ...state,
                isLoading: true,
                activeChats: []
            }
        case AdminActions.GET_ACTIVE_CHAT_RESPONSE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                activeChats: action.payload


            }
        case AdminActions.GET_ACTIVE_CHAT_RESPONSE_FAIL:
            return {
                ...state,
                isLoading: false,
                activeChats: []

            }
        case AdminActions.ADD_NEW_CARE_PACKAGE:
            return {
                ...state,
                isLoading: true,
                failedToAddPackage: false
            }
        case AdminActions.ADD_NEW_CARE_PACKAGE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                failedToAddPackage: false,
                newPackageDetails: action.payload
            }
        case AdminActions.ADD_NEW_CARE_PACKAGE_FAIL:
            return {
                ...state,
                isLoading: false,
                failedToAddPackage: true
            }
        case AdminActions.ADD_NEW_CARE_PROVIDER:
            return {
                ...state,
                isLoading: true,
                failedToAddProvider: false
            }
        case AdminActions.ADD_NEW_CARE_PROVIDER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                failedToAddProvider: false,
                newProviderDetails: action.payload
            }
        case AdminActions.ADD_NEW_CARE_PROVIDER_FAIL:
            return {
                ...state,
                isLoading: false,
                failedToAddProvider: action.payload
            }

        case AdminActions.UPDATE_CARE_PROVIDER:  //update care provider
            return {
                ...state,
                isLoading: true,
                isUpdatedCareProvider: false

            }
        case AdminActions.UPDATE_CARE_PROVIDER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isUpdatedCareProvider: true
            }
        case AdminActions.UPDATE_CARE_PROVIDER_FAIL:
            return {
                ...state,
                isLoading: false,
                isUpdatedCareProvider: false

            }

        case AdminActions.ADD_OTHER_PRICING:
            return {
                ...state,
                isLoading: true,
                failedToAddOtherPricing: false
            }
        case AdminActions.ADD_OTHER_PRICING_SUCCESS:
            return {
                ...state,
                isLoading: false,
                failedToAddOtherPricing: false,
                otherPricingDetails: action.payload
            }
        case AdminActions.ADD_OTHER_PRICING_FAIL:
            return {
                ...state,
                isLoading: false,
                failedToAddOtherPricing: true
            }

        case AdminActions.GET_ALL_CARE_DETAILS_BY_REQUEST_ID:
            return {
                ...state,
                isLoading: true,
                carePackageDetails: [],
            }
        case AdminActions.GET_ALL_CARE_DETAILS_BY_REQUEST_ID_SUCCESS:
            return {
                ...state,
                isLoading: false,
                carePackageDetails: action.payload.nodes,
                careDetailsSuccess: true
            }
        case AdminActions.GET_ALL_CARE_DETAILS_BY_REQUEST_ID_FAIL:
            return {
                ...state,
                isLoading: false,
                carePackageDetails: [],
                careDetailsSuccess: false
            }
        case AdminActions.WILDCARD_PROVIDER_SEARCH:
            return {
                ...state,
                isLoading: true,
                wildCardProviders: [],
                providerList: []
            }
        case AdminActions.WILDCARD_PROVIDER_SEARCH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                wildCardProviders: action.payload.Providers,
                providerList: action.payload.Providers
            }
        case AdminActions.WILDCARD_PROVIDER_SEARCH_FAIL:
            return {
                ...state,
                isLoading: false,
                wildCardProviders: [],
                providerList: []
            }
        case AdminActions.GET_REQUEST_DETAILS_BY_REQUEST_ID:
            return {
                ...state,
                isLoading: true,
                careRequestDetails: []
            }
        case AdminActions.GET_REQUEST_DETAILS_BY_REQUEST_ID_SUCCESS:
            return {
                ...state,
                isLoading: false,
                careRequestDetails: action.payload
            }
        case AdminActions.GET_REQUEST_DETAILS_BY_REQUEST_ID_FAIL:
            return {
                ...state,
                isLoading: false,
                careRequestDetails: []
            }
        case AdminActions.UPDATE_OTHER_PRICING_BY_PRICE_ID:
            return {
                ...state,
                isLoading: true,
                isPricingUpdated: false,
                failedToUpdatePricing: false
            }
        case AdminActions.UPDATE_OTHER_PRICING_BY_PRICE_ID_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isPricingUpdated: true,
                failedToUpdatePricing: false
            }
        case AdminActions.UPDATE_OTHER_PRICING_BY_PRICE_ID_FAIL:
            return {
                ...state,
                isLoading: false,
                isPricingUpdated: false,
                failedToUpdatePricing: true
            }
        case AdminActions.UPDATE_CARE_PACKAGE_STATUS:
            return {
                ...state,
                isLoading: true,
                isStatusUpdated: false,
                failedToUpdateStatus: false
            }
        case AdminActions.UPDATE_CARE_PACKAGE_STATUS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isStatusUpdated: true,
                failedToUpdateStatus: false
            }
        case AdminActions.UPDATE_CARE_PACKAGE_STATUS_FAIL:
            return {
                ...state,
                isLoading: false,
                isStatusUpdated: false,
                failedToUpdateStatus: true
            }
        case AdminActions.RESET_CARE_DETAILS_STATUS:
            return {
                ...state,
                isLoading: false,
                careDetailsSuccess: action.payload,
            }
        case AdminActions.SET_BUTTON_CLICKED:
            return {
                ...state,
                buttonClicked: action.payload,
            }
        case AdminActions.RESET_BUTTON_CLICKED:
            return {
                ...state,
                buttonClicked: null,
            }
        case AdminActions.UPDATE_CARE_TITLE:
            return {
                ...state,
                isLoading: true
            }
        case AdminActions.UPDATE_CARE_TITLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                titleUpdated: true
            }
        case AdminActions.UPDATE_CARE_TITLE_FAIL:
            return {
                ...state,
                isLoading: false,
                titleUpdated: false
            }
        case AdminActions.UPDATE_CARE_DESC:
            return {
                ...state,
                isLoading: true
            }
        case AdminActions.UPDATE_CARE_DESC_SUCCESS:
            return {
                ...state,
                isLoading: false,
                descUpdated: true
            }
        case AdminActions.UPDATE_CARE_DESC_FAIL:
            return {
                ...state,
                isLoading: false,
                descUpdated: false
            }
        case AdminActions.RESET_CARE_UPDATE:
            return {
                ...state,
                isLoading: false,
                titleUpdated: null,
                descUpdated: null
            }
        default:
            return {
                ...state
            }
    }
}
