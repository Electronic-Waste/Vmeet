import {postRequest, postRequest2, root} from '../utils/ajax';
import {getUid, onLogin} from "../utils/cookie";

export const Login = (data,callback) => {
    const url = `${root}/login`;
    postRequest(url,data,callback);
}

export const Register = (data,callback) => {
    const url = `${root}/register`;
    postRequest(url,data,callback);
}

export const GetUserById = (id,callback) => {
    const url = `${root}/getuser?userId=${id}`;
    postRequest2(url,callback);
}

export const GetUsernameById = (id, callback) => {
    const url = `${root}/get-username?userId=${id}`;
    postRequest2(url,callback);
}

export const GetUserByUsername = (username,callback) => {
    const url = `${root}/getuserId?username=${username}`;
    postRequest2(url,callback);
}

export const UploadAvatar = (base64, callback) => {
    const url = `${root}/uploadavatar`
    const uid = getUid();
    const data = {
        avatar:base64,
        userId:uid
    }
    postRequest(url,data,callback);
}
