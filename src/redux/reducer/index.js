import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";
import ProfileReducer from './ProfileReducer';
import DocumentsReducer from "./DocumentsReducer";
import RecommendReducer from "./RecommendReducer";
import RequestReducer from "./RequestReducer";
import UserReducer from "./UserReducer";
import AdminReducer from "./AdminReducer";

export default combineReducers({
    auth: AuthReducer,
    profile: ProfileReducer,
    documents: DocumentsReducer,
    recommend: RecommendReducer,
    request: RequestReducer,
    user: UserReducer,
    admin: AdminReducer
});
