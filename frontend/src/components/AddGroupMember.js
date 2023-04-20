import {getUid} from "../utils/cookie";
import {AcceptInvitations, GetFriends, RejectInvitations} from "../service/FriendService";
import {getItem} from "../service/CreateItem";
import {UserOutlined} from "@ant-design/icons";
import {Avatar, Button, Checkbox, Col, List, Row, Skeleton} from 'antd';
import React, {useState, useEffect} from "react";
import qs from 'querystring'
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {CheckboxValueType} from "antd/es/checkbox/Group";
import {AddGroupMembers} from "../service/GroupService";


export function AddGroupMember (props) {
    let search = window.location.search;
    let json = qs.parse(search.slice(1));
    let groupId = json.groupId;

    const [friendList,setFriendList] = useState([]);
    const userList = [];

    useEffect(()=>{
        const id = getUid();
        GetFriends(id, (data) => {
            setFriendList(data);
            //console.log(data);
        });
    },[]);

    const addUser = (id) => {
        console.log("add",id);
        userList.push(id);
        console.log(userList);
    }
    const removeUser = (id) => {
        console.log("remove",id);
        userList.forEach((row,rowidx)=>{
            if(row === id)
                userList.splice(rowidx,1);
        });
        console.log(userList);
    }
    const handleClick = () => {
        const data = {
            groupId:groupId,
            userList:JSON.stringify(userList)
        };
        AddGroupMembers(data,(msg)=>{console.log(msg)});
    }

    return(
        <>
            <List>
                {friendList.map(function(row,rowidx){
                    return(<List.Item actions={[
                        <Checkbox key={rowidx} onChange={(e)=>{
                            if(e.target.checked) addUser(row.id); else removeUser(row.id)
                        }} ></Checkbox>
                    ]} key={rowidx}>
                        <Skeleton avatar title={false} loading={row.loading} active>
                            <List.Item.Meta
                                avatar={<Avatar src={'data:image/jpeg;base64,' + row.avatar} />}
                                title={row.username}
                            />
                        </Skeleton>
                    </List.Item>)
                },this)}
                <Button onClick={handleClick}>邀请入群</Button>
            </List>
        </>

    );

}