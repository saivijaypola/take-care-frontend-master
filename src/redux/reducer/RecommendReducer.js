import { RecommendActions } from '../actions/index';

const initialState = {
 
    isRecommendUpdated:false,
    recommendation:null,
    loaderRecommendation:false,
    
};


export default function (state = initialState, action) {
    switch (action.type) {

        case RecommendActions.UPDATE_INVITE:
            return{
                ...state,
                loaderRecommendation:true
            }
        case RecommendActions.UPDATE_INVITE_SUCCESS:
            return{
                ...state,
                isRecommendUpdated:true,
                loaderRecommendation:false
            }
        case RecommendActions.UPDATE_INVITE_FAILED:
            return{
                ...state,
                isRecommendUpdated:false,
                loaderRecommendation:false
            }
        case RecommendActions.GET_INVITATION:
            return{
                ...state
            }
        case RecommendActions.GET_INVITATION_SUCCESS:
            return{
                ...state,
                recommendation: action.payload
            }
        case RecommendActions.GET_INVITATION_FAILED:
            return{
                ...state,
                recommendation: null
            }
        default:
            return {
                ...state
            }
    }
}
