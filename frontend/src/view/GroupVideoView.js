import React from "react";
import {Layout} from "antd";
import {ChatSideBar} from "../components/SideBar";

import HangupDialog from "../components/HangupDialog";
import socket from "../model/socket";
import {GroupChatPage} from "../components/GroupChatPage";


export function GroupVideoView(){
    return(
        <GroupChatPage/>
    )
}
