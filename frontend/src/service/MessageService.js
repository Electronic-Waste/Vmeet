import {postRequest, root} from "../utils/ajax";

export const SendFriendMsg = (data, callback) => {
    const url = `${root}/send-messages`;
    postRequest(url, data, callback);
}

export const GetFriendMsg = (userId, friendId, callback) => {
    const url = `${root}/get-messages`;
    const data = {"userId": userId, "friendId": friendId};
    postRequest(url, data, callback);
}

export const SendGroupMsg = (data, callback) => {
    const url = `${root}/send-group-messages`;
    postRequest(url, data, callback);
}

export const GetGroupMsg = (groupId, callback) => {
    const url = `${root}/get-group-messages`;
    const data = {"groupId": groupId};
    postRequest(url, data, callback);
}
