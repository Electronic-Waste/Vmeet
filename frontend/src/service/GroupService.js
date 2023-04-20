import {postRequest, postRequest2, root} from "../utils/ajax";
import axios from "axios";
import AgoraRTC from "agora-rtc-sdk-ng";



var options = {
    // 传入 App ID
    appId: "a0ac12470002480c8dd8937a604db6b2",
    // 传入频道名
    // channel: "ChannelA",
    // 设置用户为 host (可发流) 或 audience（仅可收流）
    role: "host"
};

var rtc = {
    // 设置本地音频轨道和视频轨道。
    localAudioTrack: null,
    localVideoTrack: null,
};

var remoteUsers = {};

function fetchToken(uid, channelName, tokenRole) {
    return new Promise(function (resolve) {
        axios.post('http://124.70.155.149:8082/fetch_rtc_token', {
            uid: uid,
            channelName: channelName,
            role: tokenRole
        }, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        })
            .then(function (response) {
                const token = response.data.token;
                resolve(token);
            })
            .catch(function (error) {
                console.log(error);
            });
    })
}
//
const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
//
export async function startBasicCall(uid,channel) {

    client.setClientRole(options.role);
    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);

    // 将获取到的 Token 赋值给 join 方法中的 token 参数，然后加入频道
    let token = await fetchToken(uid, channel, 1);

    await client.join(options.appId, channel, token, uid);
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    rtc.localVideoTrack = getCanvasCustomVideoTrack();
    // rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    // rtc.localVideoTrack = getCanvasCustomVideoTrack();

    await client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
    const localPlayerContainer = document.createElement("div");
    localPlayerContainer.id = uid;
    localPlayerContainer.style.width = "25%";
    localPlayerContainer.style.height = "20%";
    document.body.append(localPlayerContainer);

    rtc.localVideoTrack.play(localPlayerContainer);
    rtc.localVideoTrack.play(document.querySelector("#local-player"));

    console.log("publish success!");
}
//
//
function getCanvasCustomVideoTrack(){
    console.log("canvas drawing")
    const canvasElement = document.querySelector("#live2d");

    const stream = canvasElement.captureStream(60);
    const [videoTrack] = stream.getVideoTracks();
    return AgoraRTC.createCustomVideoTrack({
        mediaStreamTrack: videoTrack,
    })
}




export async function leaveChannel_2() {
    console.log(rtc)
    if (rtc.localAudioTrack){
        rtc.localAudioTrack.stop()
        rtc.localAudioTrack.close()
        rtc.localAudioTrack = null
    }
    if (rtc.localVideoTrack){
        rtc.localVideoTrack.stop()
        rtc.localVideoTrack.close()
        rtc.localVideoTrack = null
    }
    //  var localStream = document.getElementById("#live2d").captureStream();
    // localStream.getTracks().forEach(track => track.stop());
    // document.querySelector(".input_video").srcObject.getTracks().forEach(track=>track.stop());


    //
    // remove remote users and player views
    remoteUsers = {};
    // document.querySelector("#remote-playerlist").innerHTML("");
    var list =  document.querySelector("#remote-playerlist");
    list.innerHTML = "";

    // leave the channel
    await client.leave();
    var title = document.querySelector("#local-player-name")
    title.innerHTML=""
    var inputVideo = document.querySelector(".input_video");
    inputVideo.innerHTML = "";

    console.log("client leaves channel success");
}

async function subscribe(user, mediaType) {
    const uid = user.uid;
    // subscribe to a remote user
    await client.subscribe(user, mediaType);
    console.log("subscribe success");
    if (mediaType === 'video') {
        const player = (`
      <div id="player-wrapper-${uid}">
        <p class="player-name">remoteUser(${uid})</p>
        <div id="player-${uid}" class="player"></div>
      </div>
   `);
        var fnode = document.createElement("div");
        fnode.setAttribute("id",`player-wrapper-${uid}`)
        var childnode = document.createElement("div");
        childnode.setAttribute("id",`player-${uid}`);
        childnode.setAttribute("class","player");
        var texture = document.createElement("p");
        texture.setAttribute("class","player-name");
        texture.innerText = `remoteUser(${uid})`;
        fnode.appendChild(texture);
        fnode.appendChild(childnode);
        document.querySelector("#remote-playerlist").append(fnode);
        user.videoTrack.play(`player-${uid}`);
    }
    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
}

function handleUserPublished(user, mediaType) {
    console.log("handleUserPublished")
    const id = user.uid;
    remoteUsers[id] = user;
    subscribe(user, mediaType);
}

function handleUserUnpublished(user) {
    const id = user.uid;
    delete remoteUsers[id];
    document.querySelector(`#player-wrapper-${id}`).remove();
}

export const GetGroups = (id,callback) => {
    const url = `${root}/get-group?userId=${id}`;
    postRequest2(url,callback);
}

export const CreateGroups = (data,callback) => {
    const url = `${root}/create-group`;
    postRequest(url,data,callback);
}

export const AddGroupMember = (groupId,userId,callback) => {
    const url = `${root}/add-group-member?groupId=${groupId}&userId=${userId}`;
    postRequest2(url,callback);
}
export const AddGroupMembers = (data,callback) => {
    const url = `${root}/add-group-members`;
    postRequest(url,data,callback);
}

export const DeleteGroupMember = (groupId,userId,callback) => {
    const url = `${root}/del-group-member?groupId=${groupId}&userId=${userId}`;
    postRequest2(url,callback);
}

export const GetGroupMember = (groupId,callback) => {
    const url = `${root}/get-group-member?groupId=${groupId}`;
    postRequest2(url,callback);
}

export const GetGroupMemberUsername = (groupId, callback) => {
    const url = `${root}/get-group-member-username?groupId=${groupId}`;
    postRequest2(url,callback);
}

