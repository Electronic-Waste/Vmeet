import {Avatar, Button, Comment, Divider, Image, List, Skeleton, Tooltip} from "antd";
import {createElement, useEffect, useRef, useState} from "react";
import moment from "moment";
import React from "react";
import Sider from "antd/es/layout/Sider";
import InfiniteScroll from 'react-infinite-scroll-component';
import TextArea from "antd/es/input/TextArea";
import {GetUserById, GetUsernameById, GetUserWithNoAvatarById} from "../service/UserService";
import {GetFriendMsg, GetGroupMsg, SendFriendMsg, SendGroupMsg} from "../service/MessageService";
import {getUid} from "../utils/cookie";
import {GetInvitations} from "../service/FriendService";
import {auth, AuthConsumer} from "../utils/Auth"
import {createWebSocket, openWebSocket, websocket} from "../utils/websocket";
import {
    GetGroupMember,
    GetGroupMemberUsername,
    GetGroupMemberWithNoAvatar,
    GetUsersInGroup
} from "../service/GroupService";
import {decrypt, encrypt} from "../service/SecurityService";

export function ChatItem (props) {
    return (
        <Comment
            author={<a>{decrypt(props.username)}</a>}
            // avatar={<Avatar src={props.avatar} alt={props.info.username} />}
            content={<p>{decrypt(props.info.content)}</p>}
            datetime={<span>{props.info.time}</span>}
        />
    );
}

/**
 * Chat in words (p2p).
 * @param props composed of 'userId' and 'friendId'
 * @returns {JSX.Element}
 */
export function ChatExcelForFriend (props) {
    if (websocket == null) openWebSocket(props.userId);
    websocket.onmessage = () => {
        auth.Refresh();
        setTimeout(clearInputArea, 100);
        console.log("WebSocket Message!");
    }

    const [data, setData] = useState([]);

    const [user, setUser] = useState({});

    const [friend, setFriend] = useState({});

    const auth = AuthConsumer();

    const messagesEndRef = useRef(null);

    useEffect(()=>{
        if (websocket == null) openWebSocket(props.userId);
        websocket.onmessage = () => {
            auth.Refresh();
            setTimeout(clearInputArea, 100);
            console.log("WebSocket Message!");
        }
        GetUsernameById(props.userId, setUser);
        GetUsernameById(props.friendId, setFriend);
        // console.log(data.length)
        // console.log("User", user);
        // console.log("Friend", friend);
        // console.log("FriendMsg", data);

    },[])

    useEffect(()=> {
        GetFriendMsg(props.userId, props.friendId, (data) => {
            let newData = data.slice();
            newData.sort(sortData);
            setData(newData);
            console.log(newData);
        });
        console.log("auth useEffect");
    }, [auth.refreshed])

    useEffect(() => {
        scrollToBottom();
        setTimeout(clearInputArea, 100);
    }, [data]);

    const sortData = (a, b) => (a.id - b.id);

    const onSubmit = (e) => {
        /* Send messages */
        let inputBox = document.getElementById("friend-chat-input-content");
        let content = inputBox.value.trim();
        if (content !== "") {
            const data = {"msg_from": props.userId, "msg_to": props.friendId, "msg_content": encrypt(content)};
            SendFriendMsg(data, console.log);
            const message = {"target": "friend-chat", "task": "refresh", "from": props.userId, "to": props.friendId};
            websocket.send(JSON.stringify(message));
            auth.Refresh();
            /* This can be replaced */
            setTimeout(clearInputArea, 100);
        }
        else clearInputArea();

    }

    const loadData = () => {

    }

    const getUsername = (item) => {
        return (props.userId == item.from) ? user.username : friend.username;
    }

    // const getAvatar = (item) => {
    //     const uid = item.from
    //     let url = localStorage.getItem('avatar' + uid);
    //     return 'data:image/jpeg;base64,' + url;
    // }

    const clearInputArea = () => {
        console.log("clearInputArea")
        document.getElementById("friend-chat-input-content").value = "";
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }

    return (
        <Sider width="20%" theme="light" style={{height: document.body.clientHeight}}>
            <div id="friend-chat-excel" style={{
                height: "80%",
                overflow: 'scroll',
                padding: '0 16px',
                border: '3px solid whitesmoke',
            }}>
                <InfiniteScroll loader={<h4>Loading...</h4>} next={loadData} hasMore={false}  dataLength={data.length} scrollableTarget="friend-chat-excel">
                    <List
                        dataSource={data}
                        renderItem={(item) => (
                            <List.Item><ChatItem info={item} username={getUsername(item)}/></List.Item>
                        )}
                    />
                </InfiniteScroll>
                <div ref={messagesEndRef}/>
            </div>
            <div id="friend-chat-input">
                <TextArea
                    id="friend-chat-input-content"
                    placeholder="Input your message!"
                    autoSize={{
                        minRows: 5,
                        maxRows: 8,
                    }}
                />
            </div>
            <div id="friend-chat-btn" style={{padding: "2px 4px"}}>
                <Button type="primary" style={{float: "right"}} onClick={onSubmit}>Send</Button>
            </div>
        </Sider>
    );
}

/**
 * Chat in words (group)
 * @param props composed of 'userId' and 'groupId'.
 */
export function ChatExcelForGroup(props) {
    if (websocket == null) openWebSocket(props.userId);
    websocket.onmessage = () => {
        auth.Refresh();
        setTimeout(clearInputArea, 100);
        console.log("WebSocket Message!");
    }

    const [data, setData] = useState([]);

    const [userList, setUserList] = useState([]);

    const auth = AuthConsumer();

    const messagesEndRef = useRef(null);

    useEffect(()=> {
        if (websocket == null) openWebSocket(props.userId);
        websocket.onmessage = () => {
            auth.Refresh();
            setTimeout(clearInputArea, 100);
            console.log("WebSocket Message!");
        }
        GetGroupMemberUsername(props.groupId, (data) => {
            let newData = data.slice();
            setUserList(newData);
            console.log("data", data);
            console.log("userList", userList);
        });
        // GetGroupMemberUsername(props.groupId, setUserList);
        // GetGroupMsg(props.groupId, setData);
        // console.log("userList", userList);
        // console.log("data", data);
    }, [])

    useEffect(()=> {
        GetGroupMsg(props.groupId, (data) => {
            let newData = data.slice();
            newData.sort(sortData);
            setData(newData);
        });
        console.log("auth useEffect");
    }, [auth.refreshed])

    useEffect(() => {
        scrollToBottom();
        setTimeout(clearInputArea, 100);
    }, [data]);

    const sortData = (a, b) => (a.id - b.id);

    const onSubmit = (e) => {
        /* Send messages */
        let inputBox = document.getElementById("group-chat-input-content");
        let content = inputBox.value.trim();
        if (content !== "") {
            const data = {"userId": props.userId, "groupId": props.groupId, "content": encrypt(content)}
            SendGroupMsg(data, console.log);
            let idList = userList.map((item) => item.id)
            const message = {"target": "group-chat", "task": "refresh", "from": props.userId, "to": props.groupId, "members": idList};
            websocket.send(JSON.stringify(message));
            auth.Refresh();
            /* This can be replaced */
            setTimeout(clearInputArea, 100);
        }
        else clearInputArea();
    }

    const loadData = () => {

    }

    const getUsername = (item) => {
        // console.log("item", item);
        console.log("userList", userList);
        let user = userList.find(element => element.id == item.userId);
        // console.log("user", user);
        return user.username;
    }

    // const getAvatar = (item) => {
    //     const uid = item.userId
    //     // console.log("userList", userList);
    //     // console.log("data", data);
    //     let url = localStorage.getItem('avatar' + uid);
    //     return 'data:image/jpeg;base64,' + url;
    // }

    const clearInputArea = () => {
        console.log("clearInputArea")
        document.getElementById("group-chat-input-content").value = "";
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }

    return (
        <Sider width="20%" theme="light" style={{height: document.body.clientHeight}}>
            <div id="group-chat-excel" style={{
                height: "80%",
                overflow: 'scroll',
                padding: '0 16px',
                border: '3px solid whitesmoke',
            }}>
                <InfiniteScroll loader={<h4>Loading...</h4>} next={loadData} hasMore={false} dataLength={data.length} scrollableTarget="group-chat-excel">
                    <List
                        dataSource={data}
                        renderItem={(item) => (
                            <List.Item><ChatItem info={item} username={getUsername(item)}/></List.Item>
                        )}
                    />
                </InfiniteScroll>
                <div ref={messagesEndRef}/>
            </div>
            <div id="group-chat-input">
                <TextArea
                    id="group-chat-input-content"
                    placeholder="Input your message!"
                    autoSize={{
                        minRows: 5,
                        maxRows: 8,
                    }}
                />
            </div>
            <div id="group-chat-btn" style={{padding: "2px 4px"}}>
                <Button type="primary" style={{float: "right"}} onClick={onSubmit}>Send</Button>
            </div>
        </Sider>
    );
}
