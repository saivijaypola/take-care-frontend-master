import { takeLatest, put, call } from 'redux-saga/effects';
import { axiosGet, axiosPost, axiosPostExternal } from '../../handler/apiHandler';
import { AdminActions } from '../actions/index'
import { mutation, query, unAuthorizedMutation, unAuthorizedQuery } from "../../graphql/graphqlHandler";
import getCareByRequestId from '../../graphql/query/AdminCare/getAllCarePackageByRequestId';
import getRequestByRequestId from '../../graphql/query/AdminCare/getRequestDetailsByRequestId';
import updatePricingGql from '../../graphql/query/AdminCare/updatePricingByPriceId';
import updateCareTitleGql from '../../graphql/query/AdminCare/updateCareTitleByCareId';
import updateCareDescGql from '../../graphql/query/AdminCare/updateCareDescByCareId';
import { updateCarePackageStatusFail } from '../actions/AdminAction';

//Get All Providers
function* getAllProviders(action) {


   // const apiResponse = yield call(axiosGet, 'all/providers/100');
   const { pageSize, offset } = action.payload;
    const apiResponse = yield call(axiosGet, `providers/searchby/all/all/${offset}/${pageSize}`);

    if (apiResponse.error) {
        yield put(AdminActions.getAllProvidersFail(null))
    }
    else if (apiResponse.response) {
        yield put(AdminActions.getAllProvidersSuccess(apiResponse.response.data))
    }

}



//Get All Providers
function* getAllResponds(action) {

    const { requestId } = action.payload;
    const apiResponse = yield call(axiosGet, `providers/${requestId}`);

    if (apiResponse.error) {
        yield put(AdminActions.getAllRespondsFail(null))
    }
    else if (apiResponse.response) {
        yield put(AdminActions.getAllRespondsSuccess(apiResponse.response.data))
    }

}

//Get All Active Chats
function* getActiveChatResponse(action) {

    const { requestId } = action.payload;
    const apiResponse = yield call(axiosGet, `activechats/${requestId}`);

    if (apiResponse.error) {
        yield put(AdminActions.getActiveChatResponseFail(null))
    }
    else if (apiResponse.response) {
        yield put(AdminActions.getActiveChatResponseSuccess(apiResponse.response.data))
    }

}

//ADD New Care Package
function* addNewCarePackage(action) {
    const apiResponse = yield call(axiosPostExternal, `care/new-package`, action.payload);

    if (apiResponse.error) {
        yield put(AdminActions.addNewCarePackageFail(null))
    }
    else if (apiResponse.response && apiResponse.response.data) {
        yield put(AdminActions.addNewCarePackageSuccess(apiResponse.response.data.returnMessage))
    } else {
        yield put(AdminActions.addNewCarePackageFail(null))
    }
}

//ADD New Care Provdier
function* addNewCareProvider(action) {
    const apiResponse = yield call(axiosPostExternal, `care/add-provider`, action.payload);
    console.log('CARE PROVIDER', apiResponse);
    if (apiResponse.error) {
        yield put(AdminActions.addNewCareProviderFail(true))
    }
    else if (apiResponse.response && apiResponse.response.data) {
        yield put(AdminActions.addNewCareProviderSuccess(apiResponse.response.data.returnMessage))
    } else {
        yield put(AdminActions.addNewCareProviderFail(true))
    }
}

//Update Care Provider

function* updateCareProvider(action) {
    console.log('PAYLOAD', action.payload);
    const { careProviderId, data } = action.payload;

    const apiResponse = yield call(axiosPostExternal, `care/update-provider/${careProviderId}`, data);
    if (apiResponse.error) {
        yield put(AdminActions.updateCareProviderFail(null))
    }
    else if (apiResponse.response && apiResponse.response.data) {
        yield put(AdminActions.updateCareProviderSuccess(apiResponse.response.data.returnMessage))
    }
}
//ADD Other Pricing
function* addOtherPricing(action) {
    const apiResponse = yield call(axiosPostExternal, `care/add-pricing`, action.payload);
    console.log('OTHER PRICING', apiResponse);

    if (apiResponse.error) {
        yield put(AdminActions.addOtherPricingFail(null))
    }
    else if (apiResponse.response && apiResponse.response.data) {
        yield put(AdminActions.addOtherPricingSuccess(apiResponse.response.data.msg))
    } else {
        console.log(apiResponse)
        yield put(AdminActions.addOtherPricingFail(null))
    }
}



//Get All Care Details By Request Id
function* getAllCareDetailsByRequestId(action) {
    const { requestId } = action.payload;
    let data =
        { "requestId": requestId }
    const graphqlResponse = yield call(query, getCareByRequestId, data);

    if (graphqlResponse.allTblCarePackages) {
        yield put(AdminActions.getAllCareDetailsByRequestIdSuccess(graphqlResponse.allTblCarePackages))
    } else {
        yield put(AdminActions.getAllCareDetailsByRequestIdFail(graphqlResponse))
    }
}

//Get Request Details By Request Id
function* getRequestDetailsByRequestId(action) {
    const { requestId } = action.payload;
    let data =
        { "requestId": requestId }
    const graphqlResponse = yield call(query, getRequestByRequestId, data);

    if (graphqlResponse.tblRequestByRequestId.nodeId) {
        yield put(AdminActions.getRequestDetailsByRequestIdSuccess(graphqlResponse.tblRequestByRequestId))
    } else {
        yield put(AdminActions.getRequestDetailsByRequestIdFail(graphqlResponse))
    }
}


//Get Provider Search
function* wildCardSearch(action) {
    const { type, value, offset, pageSize } = action.payload;
    const apiResponse = yield call(axiosGet, `providers/searchby/${type}/${value}/50/0`);

    if (apiResponse.error) {
        yield put(AdminActions.wildCardSearchFail(null))
    }
    else if (apiResponse.response && apiResponse.response.data) {
        yield put(AdminActions.wildCardSearchSuccess(apiResponse.response.data))
    } else {
        console.log(apiResponse)
        yield put(AdminActions.wildCardSearchFail(null))
    }
}

//Update Other Pricing
function* updatePricing(action) {

    const graphqlResponse = yield call(mutation, updatePricingGql, action.payload);

    if (graphqlResponse.updateTblPackagePricingByPriceId) {
        yield put(AdminActions.updatePricingSuccess(graphqlResponse.updateTblPackagePricingByPriceId.tblPackagePricing))
    } else {
        yield put(AdminActions.updatePricingFailed(graphqlResponse))
    }

}

//Update Care Title
function* updateCareTitle(action) {

    const graphqlResponse = yield call(mutation, updateCareTitleGql, action.payload);

    if (graphqlResponse.updateTblCarePackageByCareId) {
        yield put(AdminActions.updateCareTitleSuccess())
    } else {
        yield put(AdminActions.updateCareTitleFail(graphqlResponse))
    }

}

//Update Care Description
function* updateCareDesc(action) {

    const graphqlResponse = yield call(mutation, updateCareDescGql, action.payload);
    console.log('GQL RESPONSE', graphqlResponse);

    if (graphqlResponse.updateTblCarePackageByCareId) {
        yield put(AdminActions.updateCareDescSuccess())
    } else {
        yield put(AdminActions.updateCareDescFail(graphqlResponse))
    }

}

//Update Care Package Status
function* updateCarePackageStatus(action) {
    const { careid, status } = action.payload;
    const apiResponse = yield call(axiosGet, `care/updatestatus/${careid}/${status}`, action.payload);

    if (apiResponse.error === null && apiResponse.response.status === 200) {
        yield put(AdminActions.updateCarePackageStatusSuccess(apiResponse.response))
    } else {
        yield put(AdminActions.updateCarePackageStatusFail(apiResponse))
    }

}


export default function* AdminSagas() {
    yield takeLatest(AdminActions.GET_ALL_PROVIDERS, getAllProviders);
    yield takeLatest(AdminActions.GET_ALL_RESPONDS, getAllResponds);
    yield takeLatest(AdminActions.GET_ACTIVE_CHAT_RESPONSE, getActiveChatResponse);
    yield takeLatest(AdminActions.ADD_NEW_CARE_PACKAGE, addNewCarePackage);
    yield takeLatest(AdminActions.ADD_NEW_CARE_PROVIDER, addNewCareProvider);
    yield takeLatest(AdminActions.ADD_OTHER_PRICING, addOtherPricing);
    yield takeLatest(AdminActions.GET_ALL_CARE_DETAILS_BY_REQUEST_ID, getAllCareDetailsByRequestId);
    yield takeLatest(AdminActions.WILDCARD_PROVIDER_SEARCH, wildCardSearch);
    yield takeLatest(AdminActions.GET_REQUEST_DETAILS_BY_REQUEST_ID, getRequestDetailsByRequestId);
    yield takeLatest(AdminActions.UPDATE_OTHER_PRICING_BY_PRICE_ID, updatePricing);
    yield takeLatest(AdminActions.UPDATE_CARE_PACKAGE_STATUS, updateCarePackageStatus);
    yield takeLatest(AdminActions.UPDATE_CARE_PROVIDER, updateCareProvider);
    yield takeLatest(AdminActions.UPDATE_CARE_TITLE, updateCareTitle);
    yield takeLatest(AdminActions.UPDATE_CARE_DESC, updateCareDesc);
}