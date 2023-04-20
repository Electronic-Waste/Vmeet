import React, {useEffect, useRef, useState} from "react";
import {
    CloseOutlined,
    PhoneOutlined,
    SelectOutlined, SettingOutlined,
    SoundOutlined,
    TeamOutlined,
    UserOutlined,
    VideoCameraOutlined, WechatOutlined
} from "@ant-design/icons";
import {Menu, Layout, Switch,Tooltip, Avatar} from "antd";
import {getItem} from "../service/CreateItem";
import "../css/bar.css"
import {useNavigate} from "react-router-dom";
import {GetFriends} from "../service/FriendService";
import {getUid, loginUser} from "../utils/cookie";
import {AuthConsumer} from "../utils/Auth";
import {MenuProps} from "antd";
import MenuItem from "antd/es/menu/MenuItem";
import {GetGroups} from "../service/GroupService";
import {decrypt, encrypt} from "../service/SecurityService";
const {Sider} = Layout

/**
 * This component renders the functional button (e.g. Friend, Group) in the left of the page.
 */
export function LeftSideBar () {
    const navigate = useNavigate();
    const uid = getUid();

    const items = [
        getItem('Friend', 'sub1', <UserOutlined/>, null),
        getItem('Group', 'sub2',<TeamOutlined />, null)
    ]

    const clickMenuItem = ({ item, key, keyPath, domEvent }) => {
        console.log(key);
        if (key === 'sub1') {
            navigate(`/${uid}/FriendView`);
        }
        else if (key === 'sub2') {
            navigate(`/${uid}/GroupView`);
        }
    }
    return (
        <Sider  className="site-layout-background" width="8%" style={{height: document.body.clientHeight}}>
            <Menu
                mode="inline"
                theme="dark"
                style={{
                    height: '100%',
                    borderRight: 0,
                }}
                // items={items}
                onClick={clickMenuItem}
            >
                <MenuItem key='sub1'>
                    <Tooltip title="好友">
                        <UserOutlined/>好友
                    </Tooltip>
                </MenuItem>
                <MenuItem key='sub2'>
                    <Tooltip title="群组">
                        <TeamOutlined />群组
                    </Tooltip>
                </MenuItem>
            </Menu>
        </Sider>
    );
}

/**
 * This component renders group list/ friend list in the middle of the page.
 */
export function MidSideBar(props) {

    const [friendList,setFriendList] = useState([]);
    const [groupList,setGroupList] = useState([]);
    const auth = AuthConsumer();

    useEffect(()=>{
        if(props.type === "friend") {
            const id = getUid();
            let friends = [];
            GetFriends(id, (data) => {
                data.forEach((row, rowidx) => {
                    if (decrypt(row.username).indexOf(auth.searchText) !== -1) {
                        let friend = getItem(decrypt(row.username), `${row.id}`, <Avatar src={'data:image/jpeg;base64,'+row.avatar}/>, null);
                        //console.log(friend);
                        friends.push(friend);
                    }
                })
                setFriendList(friends);
                if(props.requireCallback === true)
                    props.setFriendList(data);
            });
        }
        else{
            const id = getUid();
            let groups = [];
            GetGroups(id,(data)=>{
                data.forEach((row,rowidx)=>{
                    if(row.groupName.indexOf(auth.searchText) !== -1){
                        let group = getItem(row.groupName,`${row.groupId}`,<TeamOutlined/>,null);
                        groups.push(group);
                    }
                })
                setGroupList(groups);
                if(props.requireCallback === true)
                    props.setGroupList(data);
            })
        }
    },[auth.refreshed]);

    const itempic = ()=>{
        if(props.type === "friend"){
            return friendList;
        }
        else{
            return groupList;
        }
    }

    return (
        <Sider  className="site-layout-background" width="16%" style={{height: document.body.clientHeight}}>
            <Menu
                mode="inline"
                style={{
                    height: '100%',
                    borderRight: 0,
                }}
                onClick={props.onClick}
                items={itempic()}
            />
        </Sider>
    );
}

export function ChatSideBar(props) {
    const navigate = useNavigate();

    const clickMenuItem = ({ item, key, keyPath, domEvent }) => {
        if (key === 'quit') {
            props.hangup();
        }
    }

    const cameraBtnChange = (checked) => {
        if (checked === true) {
            const constraints = {'video': true, "audio": true};
            playVideo(constraints, "one-one-localVideo");
            playVideo(constraints, "one-one-remoteVideo");
        }
        else {
            const constraints = {'video': false, "audio": true};
            playVideo(constraints, "one-one-localVideo");
            playVideo(constraints, "one-one-remoteVideo");
        }
    }

    const items = [
        getItem('Camera', 'sub1', <VideoCameraOutlined/>, [
            getItem(<Switch checkedChildren="On" unCheckedChildren="Off" onChange={cameraBtnChange}/>, 'sub1sub1', null, null),
            getItem('Select Device', 'sub1sub2', <SelectOutlined/>, null)
        ]),
        getItem('Sound', 'sub2',<SoundOutlined/>, [
            getItem(<Switch checkedChildren="On" unCheckedChildren="Off" />, 'sub2sub1', null, null),
            getItem('Select Device', 'sub2sub2', <SelectOutlined/>, null)
        ]),
        getItem('Microphone', 'sub3',<PhoneOutlined/>, [
            getItem(<Switch checkedChildren="On" unCheckedChildren="Off" />, 'sub3sub1', null, null),
            getItem('Select Device', 'sub3sub2', <SelectOutlined/>, null)
        ]),
        getItem('Settings', 'sub4', <SettingOutlined/>, null),
        getItem('Quit', 'quit', <CloseOutlined/>, null)
    ];

    async function playVideo(constraints, elementId) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            const videoElement = document.getElementById(elementId);
            videoElement.srcObject = stream;
            videoElement.play();
        } catch (error) {
            console.error('Error opening video camera :', error);
        }
    }

    return (
        <Sider className="chat-sidebar" width="12%" style={{height: document.body.clientHeight}}>
            <WechatOutlined className="chat-sidebar-logo"/>
            <h1 className="chat-sidebar-logo-name">VMeet</h1>
            <Menu
                style={{
                    height: '100%',
                    borderRight: 0,
                }}
                mode="inline"
                theme="dark"
                items={items}
                onClick={clickMenuItem}
            />
        </Sider>
    );
}
