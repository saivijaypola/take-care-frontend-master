import { createAction } from 'redux-actions';


//Update Invitation 
export const UPDATE_INVITE = "UPDATE_INVITE"
export const updateInvite = createAction(UPDATE_INVITE);

export const UPDATE_INVITE_SUCCESS = "UPDATE_INVITE_SUCCESS"
export const updateInviteSuccess = createAction(UPDATE_INVITE_SUCCESS);

export const UPDATE_INVITE_FAILED = "UPDATE_INVITE_FAILED"
export const updateInviteFailed = createAction(UPDATE_INVITE_FAILED);

//Get Invitation 
export const GET_INVITATION = "GET_INVITATION"
export const getInvitation = createAction(GET_INVITATION);

export const GET_INVITATION_SUCCESS = "GET_INVITATION_SUCCESS"
export const getInvitationSuccess = createAction(GET_INVITATION_SUCCESS);

export const GET_INVITATION_FAILED = "GET_INVITATION_FAILED"
export const getInvitationFailed = createAction(GET_INVITATION_FAILED);

