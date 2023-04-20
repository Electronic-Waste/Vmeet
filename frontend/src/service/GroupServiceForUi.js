import {postRequest2, root} from "../utils/ajax";

export const GetGroup = (id,callback) => {
    const url = `${root}/get-group`;

    postRequest2(url,callback);
}
