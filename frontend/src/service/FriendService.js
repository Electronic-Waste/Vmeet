import {postRequest, postRequest2, root} from '../utils/ajax';

export const GetFriends = (id,callback) => {
    const url = `${root}/get-friends?userId=${id}`;

    postRequest2(url,callback);
}

export const GetRooms = (id,callback) => {
    const url = `${root}/get-roomId?userId=${id}`;

    postRequest2(url,callback);
}

export const GetInvitations = (id,status,callback) => {
    const url = `${root}/get-received-invitations?userId=${id}&status=0`;

    postRequest2(url,callback);
}

export const SendInvitations = (data,callback) => {
    const url = `${root}/send-friend-request`;

    postRequest(url,data,callback);
}

export const AcceptInvitations = (id,callback) => {
    const url = `${root}/accept-invitation?invitationId=${id}`;

    postRequest2(url,callback);
}

export const RejectInvitations = (id,callback) => {
    const url = `${root}/reject-invitation?invitationId=${id}`;

    postRequest2(url,callback);
}

export const DeleteFriends = (data,callback) => {
    const url = `${root}/delete-friend`;

    postRequest(url,data,callback);
}
