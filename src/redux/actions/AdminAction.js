import { createAction } from 'redux-actions';

export const GET_ALL_PROVIDERS = "GET_ALL_PROVIDERS"
export const getAllProviders = createAction(GET_ALL_PROVIDERS);

export const GET_ALL_PROVIDERS_SUCCESS = "GET_ALL_PROVIDERS_SUCCESS"
export const getAllProvidersSuccess = createAction(GET_ALL_PROVIDERS_SUCCESS);

export const GET_ALL_PROVIDERS_FAIL = "GET_ALL_PROVIDERS_FAIL"
export const getAllProvidersFail = createAction(GET_ALL_PROVIDERS_FAIL);



export const GET_ALL_RESPONDS = "GET_ALL_RESPONDS"
export const getAllResponds = createAction(GET_ALL_RESPONDS);

export const GET_ALL_RESPONDS_SUCCESS = "GET_ALL_RESPONDS_SUCCESS"
export const getAllRespondsSuccess = createAction(GET_ALL_RESPONDS_SUCCESS);

export const GET_ALL_RESPONDS_FAIL = "GET_ALL_RESPONDS_FAIL"
export const getAllRespondsFail = createAction(GET_ALL_RESPONDS_FAIL);


export const GET_ACTIVE_CHAT_RESPONSE = "GET_ACTIVE_CHAT_RESPONSE"
export const getActiveChatResponse = createAction(GET_ACTIVE_CHAT_RESPONSE);

export const GET_ACTIVE_CHAT_RESPONSE_SUCCESS = "GET_ACTIVE_CHAT_RESPONSE_SUCCESS"
export const getActiveChatResponseSuccess = createAction(GET_ACTIVE_CHAT_RESPONSE_SUCCESS);

export const GET_ACTIVE_CHAT_RESPONSE_FAIL = "GET_ACTIVE_CHAT_RESPONSE_FAIL"
export const getActiveChatResponseFail = createAction(GET_ACTIVE_CHAT_RESPONSE_FAIL);

export const ADD_NEW_CARE_PACKAGE = "ADD_NEW_CARE_PACKAGE"
export const addNewCarePackage = createAction(ADD_NEW_CARE_PACKAGE);

export const ADD_NEW_CARE_PACKAGE_SUCCESS = "ADD_NEW_CARE_PACKAGE_SUCCESS"
export const addNewCarePackageSuccess = createAction(ADD_NEW_CARE_PACKAGE_SUCCESS);

export const ADD_NEW_CARE_PACKAGE_FAIL = "ADD_NEW_CARE_PACKAGE_FAIL"
export const addNewCarePackageFail = createAction(ADD_NEW_CARE_PACKAGE_FAIL);

export const ADD_NEW_CARE_PROVIDER = "ADD_NEW_CARE_PROVIDER"
export const addNewCareProvider = createAction(ADD_NEW_CARE_PROVIDER);

export const ADD_NEW_CARE_PROVIDER_SUCCESS = "ADD_NEW_CARE_PROVIDER_SUCCESS"
export const addNewCareProviderSuccess = createAction(ADD_NEW_CARE_PROVIDER_SUCCESS);

export const ADD_NEW_CARE_PROVIDER_FAIL = "ADD_NEW_CARE_PROVIDER_FAIL"
export const addNewCareProviderFail = createAction(ADD_NEW_CARE_PROVIDER_FAIL);

export const UPDATE_CARE_PROVIDER = "UPDATE_CARE_PROVIDER"
export const updateCareProvider = createAction(UPDATE_CARE_PROVIDER);

export const UPDATE_CARE_PROVIDER_SUCCESS = "UPDATE_CAER_PROVIDER_SUCCESS"
export const updateCareProviderSuccess =  createAction(UPDATE_CARE_PROVIDER_SUCCESS);

export const UPDATE_CARE_PROVIDER_FAIL = "UPDATE_CARE_PROVIDER_FAIL"
export const updateCareProviderFail = createAction(UPDATE_CARE_PROVIDER_FAIL);

export const ADD_OTHER_PRICING = "ADD_OTHER_PRICING"
export const addOtherPricing = createAction(ADD_OTHER_PRICING);

export const ADD_OTHER_PRICING_SUCCESS = "ADD_OTHER_PRICING_SUCCESS"
export const addOtherPricingSuccess = createAction(ADD_OTHER_PRICING_SUCCESS);

export const ADD_OTHER_PRICING_FAIL = "ADD_OTHER_PRICING_FAIL"
export const addOtherPricingFail = createAction(ADD_OTHER_PRICING_FAIL);




export const GET_ALL_CARE_DETAILS_BY_REQUEST_ID = "GET_ALL_CARE_DETAILS_BY_REQUEST_ID"
export const getAllCareDetailsByRequestId = createAction(GET_ALL_CARE_DETAILS_BY_REQUEST_ID);

export const GET_ALL_CARE_DETAILS_BY_REQUEST_ID_SUCCESS = "GET_ALL_CARE_DETAILS_BY_REQUEST_ID_SUCCESS"
export const getAllCareDetailsByRequestIdSuccess = createAction(GET_ALL_CARE_DETAILS_BY_REQUEST_ID_SUCCESS);

export const GET_ALL_CARE_DETAILS_BY_REQUEST_ID_FAIL = "GET_ALL_CARE_DETAILS_BY_REQUEST_ID_FAIL"
export const getAllCareDetailsByRequestIdFail = createAction(GET_ALL_CARE_DETAILS_BY_REQUEST_ID_FAIL);


export const WILDCARD_PROVIDER_SEARCH = "WILDCARD_PROVIDER_SEARCH"
export const wildCardSearch = createAction(WILDCARD_PROVIDER_SEARCH);

export const WILDCARD_PROVIDER_SEARCH_SUCCESS = "WILDCARD_PROVIDER_SEARCH_SUCCESS"
export const wildCardSearchSuccess = createAction(WILDCARD_PROVIDER_SEARCH_SUCCESS);

export const WILDCARD_PROVIDER_SEARCH_FAIL = "WILDCARD_PROVIDER_SEARCH_FAIL"
export const wildCardSearchFail = createAction(WILDCARD_PROVIDER_SEARCH_FAIL);

export const GET_REQUEST_DETAILS_BY_REQUEST_ID = "GET_REQUEST_DETAILS_BY_REQUEST_ID"
export const getRequestDetailsByRequestId = createAction(GET_REQUEST_DETAILS_BY_REQUEST_ID);

export const GET_REQUEST_DETAILS_BY_REQUEST_ID_SUCCESS = "GET_REQUEST_DETAILS_BY_REQUEST_ID_SUCCESS"
export const getRequestDetailsByRequestIdSuccess = createAction(GET_REQUEST_DETAILS_BY_REQUEST_ID_SUCCESS);

export const GET_REQUEST_DETAILS_BY_REQUEST_ID_FAIL = "GET_REQUEST_DETAILS_BY_REQUEST_ID_FAIL"
export const getRequestDetailsByRequestIdFail = createAction(GET_REQUEST_DETAILS_BY_REQUEST_ID_FAIL);

export const UPDATE_OTHER_PRICING_BY_PRICE_ID = "UPDATE_OTHER_PRICING_BY_PRICE_ID"
export const updatePricing = createAction(UPDATE_OTHER_PRICING_BY_PRICE_ID);

export const UPDATE_OTHER_PRICING_BY_PRICE_ID_SUCCESS = "UPDATE_OTHER_PRICING_BY_PRICE_ID_SUCCESS"
export const updatePricingSuccess = createAction(UPDATE_OTHER_PRICING_BY_PRICE_ID_SUCCESS);

export const UPDATE_OTHER_PRICING_BY_PRICE_ID_FAIL = "UPDATE_OTHER_PRICING_BY_PRICE_ID_FAIL"
export const updatePricingFail = createAction(UPDATE_OTHER_PRICING_BY_PRICE_ID_FAIL);

export const UPDATE_CARE_PACKAGE_STATUS = "UPDATE_CARE_PACKAGE_STATUS"
export const updateCarePackageStatus = createAction(UPDATE_CARE_PACKAGE_STATUS);

export const UPDATE_CARE_PACKAGE_STATUS_SUCCESS = "UPDATE_CARE_PACKAGE_STATUS_SUCCESS"
export const updateCarePackageStatusSuccess = createAction(UPDATE_CARE_PACKAGE_STATUS_SUCCESS);

export const UPDATE_CARE_PACKAGE_STATUS_FAIL = "UPDATE_CARE_PACKAGE_STATUS_FAIL"
export const updateCarePackageStatusFail = createAction(UPDATE_CARE_PACKAGE_STATUS_FAIL);

export const RESET_CARE_DETAILS_STATUS = "RESET_CARE_DETAILS_STATUS"
export const resetCareDetailsStatus = createAction(RESET_CARE_DETAILS_STATUS);

export const SET_BUTTON_CLICKED = "SET_BUTTON_CLICKED"
export const setButtonClicked = createAction(SET_BUTTON_CLICKED);

export const RESET_BUTTON_CLICKED = "RESET_BUTTON_CLICKED"
export const resetButtonClicked = createAction(RESET_BUTTON_CLICKED);

export const UPDATE_CARE_TITLE = "UPDATE_CARE_TITLE"
export const updateCareTitle = createAction(UPDATE_CARE_TITLE);

export const UPDATE_CARE_TITLE_SUCCESS = "UPDATE_CARE_TITLE_SUCCESS"
export const updateCareTitleSuccess = createAction(UPDATE_CARE_TITLE_SUCCESS);

export const UPDATE_CARE_TITLE_FAIL = "UPDATE_CARE_TITLE_FAIL"
export const updateCareTitleFail = createAction(UPDATE_CARE_TITLE_FAIL);

export const UPDATE_CARE_DESC = "UPDATE_CARE_DESC"
export const updateCareDesc = createAction(UPDATE_CARE_DESC);

export const UPDATE_CARE_DESC_SUCCESS = "UPDATE_CARE_DESC_SUCCESS"
export const updateCareDescSuccess = createAction(UPDATE_CARE_DESC_SUCCESS);

export const UPDATE_CARE_DESC_FAIL = "UPDATE_CARE_DESC_FAIL"
export const updateCareDescFail = createAction(UPDATE_CARE_DESC_FAIL);

export const RESET_CARE_UPDATE = "RESET_CARE_UPDATE"
export const resetCareUpdate = createAction(RESET_CARE_UPDATE);