import {FileAddOutlined, SearchOutlined, UserAddOutlined, UserOutlined, VideoCameraOutlined} from '@ant-design/icons';
import {Avatar, Button, Tooltip} from 'antd';
import React, {useEffect, useRef} from "react";
import { Layout, Menu } from 'antd';
import {ChatLog} from "./ChatLog";
import {useNavigate} from "react-router-dom";
import {getUid} from "../utils/cookie";
import {useState} from "react";
import Dialog from "./Dialog";
import socket from "../model/socket";
import RejectDialog from "./RejectDialog";
import {ChatDialog} from "./ChatDialog";
import {GetRooms} from "../service/FriendService";
import {getItem} from "../service/CreateItem";
import ParticlesBg from "particles-bg";
import cookie from "react-cookies";
import {decrypt} from "../service/SecurityService";

const Style1={
    marginLeft:"150px",
    width:"80px",
    height:"80px"
}

const Style2={
    marginRight:"150px",
    width:"80px",
    height:"80px"
}

const Style3={
    width:"80px",
    height:"80px"
}

/**
 * props.friendList:好友信息列表
 * props.select:选中好友的id
 */

export function FriendContent(props) {
    const navigate = useNavigate();

    const sending = useRef();       // sending.current is caller's roomId

    const commun = useRef();        // commun.current is callee's roomId

    const [avatar,setAvatar] = useState(null);
    const [friend,setFriend] = useState(null);
    const [friendList, setFriendList] = useState([]);
    //console.log(props.friendList);

    useEffect(()=>{
        props.friendList.forEach((row,rowidx)=>{
            //console.log('比较',row,props.select);
            if(Number(row.id) === Number(props.select)) {
                let url = 'data:image/jpeg;base64,'+row.avatar;
                setAvatar(url);
                setFriend(row);
            }
        })
        //if(avatar === null)
        //    setAvatar("https://joeschmoe.io/api/v1/random");
    },[props.select]);

    useEffect(()=>{
        //add the function that get all roomid and enter the corresponding room
        const id = getUid();

        var room_arr = new Array();

        GetRooms(id,(data)=>{
            data.forEach((row,rowidx)=>{
                //console.log("row",row);

                let roomid = row.id;
                room_arr.push(roomid);

                friendList.push(row);

                if(props.select == row.friendId || props.select == row.userId){
                    console.log("sure sending")
                    sending.current = "room_" + row.id;
                }

            })

            console.log(room_arr);

            socket.emit("enter",room_arr);
        });

    },[props.select]);


    //control the visiability of Dialog
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [isReject,setIsReject] = useState(false);

    const [isChat,setIsChat] = useState(false);

    const isSimple = useRef();

    const isCaller = useRef();

    const handleClickCamera = () => {

        console.log("sending NewClient");
        // socket.emit("NewClient");
        setIsChat(true);

        isCaller.current = true;

        //const uid = getUid();
        //navigate(`/${uid}/ChatView`);
        // navigate("/0001/1/ChatView");

    }

    const onOk = () => {
        console.log("ok hit");
        setIsModalVisible(false);

        //represent that the counterpart receive the call
        // socket.emit("called");

        // navigate("/0001/2/ChatView");

        setIsChat(true);
    }

    const onCancel = () => {
        socket.emit("failed",commun.current);
        setIsModalVisible(false);
    }

    function response(data) {
        console.log("response");
        console.log(data);
        console.log(isModalVisible);

        commun.current = data;
        console.log("debug1")
        console.log(data);
        setIsModalVisible(true);
        console.log("debug2")

        isCaller.current = false;
    }

    const fail= () => {
        console.log("failed");
        setIsReject(true);
    }

    const jump=()=>{
        console.log("receive successfully");
        console.log("Callee Id", getCalleeId());
        if(isSimple.current == true){
            navigate("/" + sending.current + "/1/ChatView", {state: {"userId": getUid(), "friendId": getCalleeId()}});
        }
        else{
            navigate("/" + sending.current + "/1/VtuberView", {state: {"userId": getUid(), "friendId": getCalleeId()}});
        }
    }

    const getCalleeId = () => {
        let roomIdString = sending.current;
        let roomId = roomIdString.toString().substring(5);
        console.log("roomId" + roomId);
        console.log("friendList", friendList);
        let friendPair = friendList.find((item) => item.id == roomId);
        console.log("friendPair", friendPair);
        return friendPair.userId == getUid() ? friendPair.friendId : friendPair.userId;
    }

    const getCallerId = () => {
        let roomIdString = commun.current;
        let roomId = roomIdString.toString().substring(5);
        console.log("roomId", roomId);
        GetRooms(getUid(), setFriendList)
        console.log("friendList", friendList);
        let friendPair = friendList.find((item) => item.id == roomId);
        console.log("friendPair", friendPair);
        return friendPair.userId == getUid() ? friendPair.friendId : friendPair.userId;
    }

    useEffect(() => {
        // componentDidMount
        socket.on("call",response);
        socket.on("failed",fail);
        socket.on("receive",jump);
        return () => {
            // componentWillUnmount
            socket.off('message', response);
            socket.off("failed",fail);
            socket.off("receive",jump);
        };
    }, [socket]);

    return(
        <div>{props.select === null ?
            <div className="content-friend">
                <Avatar size={200} icon=<UserOutlined/>/>
                <h1>广告词招租</h1>
                <Dialog show={isModalVisible} onok={onOk} oncancel={onCancel}></Dialog>
                <RejectDialog show={isReject} onok={()=>{
                    setIsReject(false);
                }}></RejectDialog>
                <ChatDialog show={isChat} onok={()=>{
                    isSimple.current = true;
                    setIsChat(false);

                    if(isCaller.current === true){
                        socket.emit("NewClient",sending.current);
                    }
                    else{
                        socket.emit("called",commun.current);
                        navigate("/"+ commun.current + "/2/ChatView", {state: {"userId": getUid(), "friendId": getCallerId()}});
                    }
                }} oncancel={()=>{
                    isSimple.current = false;
                    setIsChat(false);

                    if(isCaller.current === true){
                        socket.emit("NewClient",sending.current);
                    }
                    else{
                        socket.emit("called",commun.current);
                        navigate("/"+ commun.current + "/2/VtuberView", {state: {"userId": getUid(), "friendId": getCallerId()}});
                    }
                }}></ChatDialog>
                {/*<Avatar size={200} icon=<UserOutlined/>/>*/}
                <ParticlesBg type="custom" bg={false} />
            </div> :
            <div>
                <div className="content-friend">
                    <Avatar size={200} src={avatar}/>
                    <h1 className="content-group-name">{friend === null ?  <></>: decrypt(friend.username)}</h1>
                </div>
                <div className="content-button">
                    <Tooltip title={"视频通话"}>
                        <Button shape="circle" icon={<VideoCameraOutlined style={{fontSize:"48px"}} onClick={handleClickCamera}/>} style={Style2}/>
                    </Tooltip>
                    <Tooltip title={"文件传输"}>
                        <Button shape="circle" icon={<FileAddOutlined style={{fontSize:"48px"}}/>} style={Style3}/>
                    </Tooltip>

                    {/*<Button shape="circle" icon={<UserAddOutlined style={{fontSize:"48px"}}/>} style={Style1}/>*/}
                </div>
                <div className="content-button">
                    <p className="afont-logo" style={{color:"black"}}>最近通话记录</p>
                </div>
                <div className="content-button">
                    <ul>
                        <li style={{listStyle:"none"}}>
                            <ChatLog time={"1:22:20"} timeslice={"2022.6.22.10:00"}></ChatLog>
                            <ChatLog time={"2:00:50"} timeslice={"2022.6.22.12:00"}></ChatLog>
                        </li>
                    </ul>
                </div>
                <Dialog show={isModalVisible} onok={onOk} oncancel={onCancel}></Dialog>
                <RejectDialog show={isReject} onok={()=>{
                    setIsReject(false);
                }}></RejectDialog>
                <ChatDialog show={isChat} onok={()=>{
                    isSimple.current = true;
                    setIsChat(false);

                    if(isCaller.current === true){
                        socket.emit("NewClient",sending.current);
                    }
                    else{
                        socket.emit("called",commun.current);
                        navigate("/"+ commun.current + "/2/ChatView", {state: {"userId": getUid(), "friendId": getCallerId()}});
                    }
                }} oncancel={()=>{
                    isSimple.current = false;
                    setIsChat(false);

                    if(isCaller.current === true){
                        socket.emit("NewClient",sending.current);
                    }
                    else{
                        socket.emit("called",commun.current);
                        navigate("/"+ commun.current + "/2/VtuberView", {state: {"userId": getUid(), "friendId": getCallerId()}});
                    }
                }}></ChatDialog>
            </div>
        }
        </div>
    );
}
