import React, {useEffect, useRef, useState} from "react";
import {Avatar, Layout, Button, Divider, Skeleton, List, Empty, Modal, Alert, Tooltip} from "antd";
import {UserOutlined, UserAddOutlined, VideoCameraOutlined, UserDeleteOutlined} from "@ant-design/icons";

import {getUid} from "../utils/cookie";
import {useNavigate} from "react-router-dom";
import {ChoiceDialog} from "../view/VtuberViewForGroup";
import {DeleteGroupMember} from "../service/GroupService";
import {AuthConsumer} from "../utils/Auth";

import {AddGroupMemberView} from "../view/AddGroupMemberView";

import {startBasicCall} from "../service/GroupService";
import socket from "../model/socket";
import {UseSpringDemoPage} from "./EmptyForGroup";
import {Ticker} from "pixi.js";
import GroupMemberList from "./GroupMemberList";

const datacache = ["../../models/hiyori/hiyori_pro_t10.model3.json","../../models/haru_greeter_pro_jp/runtime/haru_greeter_t03.model3.json"
    ,"../../models/mao_pro_zh/runtime/mao_pro_t02.model3.json"];

const {Content} = Layout

export function InfoExcel(props) {

    return (
        <List
            itemLayout="horizontal"
            dataSource={props.data}
            renderItem={(item) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar icon={item.icon}  style={{ color: 'black', backgroundColor: 'white'}}/>}
                        title={<a href="https://ant.design">{item.title}</a>}
                        description={item.description}
                    />
                    <div>More Info...</div>
                </List.Item>
            )}
        />
    );
}

export function GroupPage (props){
    const navigate = useNavigate();

    const [show,setShow] = useState(false);
    // const [isChoice,setIsChoice] = useState(false);
    const modelUrl = useRef("../../models/hiyori/hiyori_pro_t10.model3.json")
    var urlForModel = "./models/hiyori/hiyori_pro_t10.model3.json";

    const [group,setGroup] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const auth = AuthConsumer();

    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const handleOk = () => {
        setIsModalVisible(false);
        let groupId = group.groupId;
        let userId = getUid();
        DeleteGroupMember(groupId,userId,(data)=>{
                console.log(data);
        })
        auth.Refresh();
    };
    useEffect(()=>{
        props.groupList.forEach((row,rowidx)=>{
            //console.log(row);
            if(Number(row.groupId) === Number(props.select)) {
                setGroup(row);
                console.log(row);
            }
        })
    },[props.select,auth.refreshed]);



    const userItems = [
        {title: "Wei Jinlin", icon: <UserOutlined/>, description: "6 mins ago"},
        {title: "Song Junqing", icon: <UserOutlined/>, description: "3 mins ago"}
    ]

    const chatItems = [
        {title: "Wei Jinlin发起的通话", icon: <VideoCameraOutlined/>, description: "6 mins ago"},
        {title: "Song Junqing发起的通话", icon: <VideoCameraOutlined/>, description: "3 mins ago"}
    ]
    const readyFotjoin = () => {
        console.log("join group")
        setShow(true)
        // console.log(getUid());
        // var uid = getUid();
        // uid = parseInt(uid)
        // var groupId = 1;
        // // console.log(uid)
        // navigate(`/${uid}/${groupId}/GroupVideo`)
        // startBasicCall(uid,"room");
        // console.log("room");

    }
    const selectModel = () => {
        var groupId = 1;
        // console.log(uid)
        setShow(true)
        // startBasicCall(uid,"room");
        console.log("room");

    }

    const join = () => {
        var uid = getUid();
        uid = parseInt(uid);

        navigate(`/${uid}/GroupVideo`,{state:{modelUrl:modelUrl.current,groupId:group.groupId}});
    }

    return (
        <Content
            className="site-layout-background"
            style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
            }}
        >
            {props.select === null ?
                <div className="content-group-avatar">
                    {/*<Avatar style={{color: 'black', backgroundColor: 'white'}}*/}
                    {/*        size={240}*/}
                    {/*        icon={<UserOutlined/>}/>*/}
                    <Empty description={"Group seems silent. Walk Around!"} />
                    <UseSpringDemoPage/>
                </div> :
                <>
                    <div className="content-group-avatar">
                        <Alert
                            style={{
                                margin: '8px 0',
                            }}
                            message="There is someone calling!"
                        />
                        <Avatar style={{color: 'black', backgroundColor: 'white'}}
                            size={240}
                            icon={<UserOutlined/>}/>
                </div>
                <h1 className="content-group-name">{group === null ?  <></>: group.groupName}</h1>
                <div className="content-group-btngroup">
                    <Tooltip title={"Video Phone"}>
                        <Button className="content-group-btn" onClick={selectModel} style={{width: "64px", height: "64px"}}
                                shape="circle" icon={<VideoCameraOutlined style={{fontSize: "36px"}}/>}/>
                    </Tooltip>
                    <Tooltip title={"Invite Friends"}>
                        <Button className="content-group-btn"  style={{width: "64px", height: "64px"}}
                                onClick={()=>{navigate(`/${getUid()}/AddGroupMemberView?groupId=${group.groupId}`)}}
                                shape="circle" icon={<UserAddOutlined style={{fontSize: "36px"}}/>}/>
                    </Tooltip>
                    <Tooltip title={"Leave Group"}>
                        <Button className="content-group-btn" style={{width: "64px", height: "64px"}} shape="circle"
                                onClick={()=>{showModal();}}
                                icon={<UserDeleteOutlined style={{fontSize: "36px"}}/>}/>
                    </Tooltip>
                </div>
                <div className="content-group-info">
                    <div className="content-group-userexcel">
                        <h1 style={{fontSize: "24px"}}>群成员信息</h1>
                        <InfoExcel data={userItems}/>
                        {/*<GroupMemberList/>*/}
                    </div>
                    <div className="content-group-chatexcel">
                        <h1 style={{fontSize: "24px"}}>群通话记录</h1>
                        <InfoExcel data={chatItems}/>
                    </div>
                </div>
                    <ChoiceDialog show={show} onok={join} oncancel={()=>{
                        setShow(false);
                    }} onchange={(value)=>{
                        console.log(`selected ${value}`);
                        console.log(value);
                        if(value === 'first'){
                            modelUrl.current = datacache[0];
                        }
                        else if(value === "second"){
                            modelUrl.current = datacache[1];
                        }
                        else if(value === "third"){
                            modelUrl.current = datacache[2];
                        }
                    }}></ChoiceDialog>
                </>}
                    <Modal title="确认退出群聊？" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}></Modal>
        </Content>
    );
}
