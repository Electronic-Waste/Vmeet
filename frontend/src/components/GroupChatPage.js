import "../css/chat.css"
import {Button, Layout} from "antd";
import {useEffect} from "react";
import {joinChannel, leaveChannel, leaveChannel_2, startBasicCall} from "../service/GroupService";
import {getUid} from "../utils/cookie";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/GroupChatPage.css"
import {useLocation, useNavigate} from "react-router-dom";
import {VtubChatPage} from "./ChatPage";
import {VtuberViewForGroup} from "../view/VtuberViewForGroup";
import {Divider} from "@mui/material";
import {ChatExcelForGroup} from "./ChatExcel";
import {ChatSideBar} from "./SideBar";
import React from "react";

export function GroupChatPage(){
    const navigate = useNavigate();

    const leave = () => {
        leaveChannel_2();
        navigate(-1);

        var live2d = document.querySelector("#live2d");
        live2d.captureStream().getTracks().forEach(track => track.stop())
        var camere = document.querySelector(".input_video");
        camere.captureStream().getTracks().forEach(track => track.stop())
        console.log(live2d.captureStream().getTracks());

        console.log(camere.captureStream().getTracks())

    }

    const {state:{modelUrl}} = useLocation();
    const {state:{groupId}} = useLocation();

    console.log(modelUrl);
    useEffect(()=>{
        var uid = getUid();
        uid = parseInt(uid)
        console.log("uid",uid)
        console.log("roomId",groupId)
        startBasicCall(uid,groupId.toString());
        // joinChannel(uid,roomName);

    },[])

    return(
        <Layout>
            <ChatSideBar/>
            <Layout>
                <div>
                    <Button id={"leave"} onClick={leave}>
                        leave
                    </Button>
                    <VtuberViewForGroup model={modelUrl}/>
                    <Divider style={{paddingTop:'15px'}}/>

                    <div className={"container"}>
                        <div className="row video-group">
                            {/*<div className="col">*/}
                            {/*    <p id="local-player-name" className={"player-name"}/>*/}
                            {/*    <div id="local-player" className={"player"}/>*/}
                            {/*</div>*/}
                            <div className="w-100"></div>
                            <div className="col">
                                <div id="remote-playerlist"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </Layout>
            <ChatExcelForGroup userId={getUid()} groupId={groupId}/>
        </Layout>
    )
}
