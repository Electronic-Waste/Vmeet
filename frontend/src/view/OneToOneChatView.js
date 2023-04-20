import {Button, Layout} from "antd";
import {ChatSideBar} from "../components/SideBar";
import {OneToOneChatPage} from "../components/ChatPage";
import {useEffect, useRef, useState} from "react";
import socket from "../model/socket";
import Peer from "simple-peer";
import HangupDialog from "../components/HangupDialog";
import {useLocation, useNavigate} from "react-router-dom";
import {ChatExcelForFriend} from "../components/ChatExcel";

export function OneToOneChatView() {
    const navigate = useNavigate();

    const {state} = useLocation();

    //control the visiability of Dialog
    const [isHangup,setIsHangup] = useState(false);

    const client = useRef({});

    const judge = useRef(0);

    const conn = useRef();

    var localVideo = document.getElementById('local_video');
    var remoteVideo = document.getElementById('remote_video');
    var localStream;
    // var client = {};
    const startAction = ()=>{
        //采集摄像头视频
        localVideo = document.getElementById('local_video');
        remoteVideo = document.getElementById('remote_video');
        navigator.mediaDevices.getUserMedia({ video: true,audio:true })
            .then(function(mediaStream){
                if(window.location.href.split('/')[4] == '1'){
                    console.log(window.location.href.split('/')[4]);
                    socket.emit("ready",conn.current);
                }
                else{
                    console.log("denug1");
                    console.log(window.location.href.split('/')[4]);
                    console.log(window.location.href);
                    console.log("debug2")
                }
                localStream = mediaStream;
                localVideo.srcObject = mediaStream;
                localVideo.play();


                //used to initialize a peer
                function InitPeer(type) {
                    let peer = new Peer({ initiator: (type === 'init') ? true : false, stream: localStream, trickle: false, config: {
                            iceServers: [
                                { urls: "stun:stun.l.google.com:19302"}, // 谷歌的公共服务
                                {
                                    urls: "turn:124.70.155.149:3478",
                                    username: "vmeet", // 用户名
                                    credential: "num11" // 密码
                                }
                            ]
                        }});
                    console.log("type " + type);
                    peer.on('stream', function (stream) {
                        // CreateVideo(stream)
                        remoteVideo.srcObject = stream;
                        remoteVideo.play();
                        remoteVideo.addEventListener("click",() => {
                            if (remoteVideo.volume != 0)
                                remoteVideo.volume = 0
                            else
                                remoteVideo.volume = 1
                        })
                    })
                    //This isn't working in chrome; works perfectly in firefox.
                    peer.on('close', function () {
                        // document.getElementById("peerVideo").remove();
                        peer.destroy();
                    })

                    peer.on('connect',function () {
                        console.log("connected");
                    })

                    /* the next code cause some bug in the React Frame,so comment them

                    // peer.on('data', function (data) {
                    //     let decodedData = new TextDecoder('utf-8').decode(data)
                    //     let peervideo = document.querySelector('#remote_video')
                    //     peervideo.style.filter = decodedData
                    // })
                    console.log("debug")

                    */

                    return peer
                }

                //for peer of type init
                function MakePeer() {
                    console.log("make peer");
                    client.current.gotAnswer = false
                    let peer = InitPeer('init')
                    console.log("signal")
                    peer.on('signal', function (data) {
                        console.log("signal boom");
                        if (!client.current.gotAnswer) {
                            socket.emit('Offer', {data:data,channel:conn.current});
                        }
                    })
                    client.current.peer = peer
                }

                //for peer of type not init
                function FrontAnswer(offer) {
                    let peer = InitPeer('notInit')
                    peer.on('signal', (data) => {
                        socket.emit('Answer', {data:data,channel:conn.current});
                    })
                    peer.signal(offer)
                    client.current.peer = peer
                }

                function SignalAnswer(answer) {
                    client.current.gotAnswer = true
                    let peer = client.current.peer
                    peer.signal(answer)
                }

                function SessionActive() {
                    document.write('Session Active. Please come back later')
                }

                function RemovePeer() {
                    if (client.current.peer) {
                        client.current.peer.destroy();
                    }
                }

                function Hangup() {
                    setIsHangup(true);
                }

                socket.on('BackOffer', FrontAnswer)
                socket.on('BackAnswer', SignalAnswer)
                socket.on('SessionActive', SessionActive)
                socket.on('CreatePeer', MakePeer)
                socket.on('Disconnect', RemovePeer)
                socket.on('hangup',Hangup);

            }).catch(function(error){
            console.log(JSON.stringify(error));
        });
    }

    useEffect(()=>{
        console.log("location", state);
        console.log("judge value")
        console.log(judge.current);
        if(judge.current == 1){

        }
        else{
            judge.current = 1;
            console.log("boom");
            conn.current = window.location.href.split('/')[3];
            console.log(conn.current);
            startAction();
        }
    },[])

    const hangupAction = () => {
        // judge.current = 0;
        // console.log(localStream);
        // if(localStream == null){
        //     localStream = localVideo.srcObject;
        // }
        // localStream.getTracks().forEach(track => track.stop());
        // console.log("in hangup");
        // console.log("check peer");
        // console.log(client.current.peer);
        // if(client.current.peer){
        //     console.log("peer okk")
        //     // client.current.peer.destroy();
        //     socket.emit("hangup");
        //     navigate(-1);
        // }
        judge.current = 0;
        console.log(localStream);
        if(localStream == null){
            localStream = localVideo.srcObject;
        }
        client.current.peer.removeStream(localStream);
        client.current.peer.removeAllListeners('signal');
        client.current.peer.removeAllListeners('stream');
        localStream.getTracks().forEach(track => track.stop());
        remoteVideo.srcObject.getTracks().forEach(track=>track.stop());
        delete localVideo.srcObject;
        delete remoteVideo.srcObject;
        console.log("in hangup");
        console.log("check peer");
        console.log(client.current.peer);
        if(client.current.peer){
            console.log("peer okk")
            try {
                // client.current.peer.destroy(["test"]);
                console.log("destory");
            }
            catch (err){
                console.log("error");
                console.log(err);
            }
            delete client.current.peer;
            client.current.peer = null;
            // hangupButton.disabled = true;
            // startButton.disabled = false;
            socket.emit("hangup",conn.current);
            console.log("all finish");
            socket.off('BackOffer')
            socket.off('BackAnswer')
            socket.off('SessionActive')
            socket.off('CreatePeer')
            socket.off('Disconnect')
            socket.off('hangup');
            socket.off("call");
            socket.off("failed");
            navigate(-1);
        }
    }



    return (
        <Layout>
            <ChatSideBar hangup={hangupAction}/>
            <Layout>
                <OneToOneChatPage/>
            </Layout>
            <ChatExcelForFriend userId={state.userId} friendId={state.friendId}/>
            <HangupDialog show={isHangup} onok={()=>{
                if(localStream == null){
                    localStream = localVideo.srcObject;
                }
                localStream.getTracks().forEach(track => track.stop());
                if(client.current.peer){
                    console.log("peer okk")
                    try {
                        // client.current.peer.destroy(["test"]);
                        console.log("destory");
                    }
                    catch (err){
                        console.log("error");
                        console.log(err);
                    }
                    delete client.current.peer;
                    client.current.peer = null;
                    // hangupButton.disabled = true;
                    // startButton.disabled = false;
                    socket.emit("hangup",conn.current);
                    console.log("all finish");
                    socket.off('BackOffer')
                    socket.off('BackAnswer')
                    socket.off('SessionActive')
                    socket.off('CreatePeer')
                    socket.off('Disconnect')
                    socket.off('hangup');
                    socket.off("call");
                    socket.off("failed");
                }
                setIsHangup(false);
                judge.current = 0;
                navigate(-1);
            }}></HangupDialog>
        </Layout>
    );
}
