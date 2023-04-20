import { Avatar, Button, List, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import {AcceptInvitations, GetInvitations, RejectInvitations} from "../service/FriendService";
import {GetUserById} from "../service/UserService";
import {getUid, loginUser} from "../utils/cookie";
import {getItem} from "../service/CreateItem";
import {UserOutlined} from "@ant-design/icons";
import {createWebSocket, openWebSocket, websocket} from "../utils/websocket";
import {AuthConsumer} from "../utils/Auth";
import {decrypt} from "../service/SecurityService";

const InvitationList = (props) => {
    if (websocket == null) openWebSocket(props.userId);
    websocket.onmessage = () => {
        auth.Refresh();
        console.log("WebSocket Message!");
    }

    const [data, setData] = useState([]);
    const [username,setUsername] = useState([]);
    //const [refresh,setRefresh] = useState(0);
    const auth = AuthConsumer();

    useEffect(() => {
        //refresh && setTimeout(() => setRefresh(false));
        const id = getUid();
        let usernames = [];
        GetInvitations(id,0,(data)=>{
            //console.log(data);
            setData(data);
        });
        setUsername(usernames);
        //console.log(username);
    }, [auth.refreshed]);

    return (
        <List>
            {data.map(function(row,rowidx){
                return(<List.Item actions={[
                    <a onClick={()=>{AcceptInvitations(row.invitation.invitationId,()=>{auth.Refresh();})}}>accept</a>,
                    <a onClick={()=>{RejectInvitations(row.invitation.invitationId,()=>{auth.Refresh();})}}>reject</a>
                ]} key={rowidx}>
                    <Skeleton avatar title={false} loading={row.loading} active>
                        <List.Item.Meta
                            avatar={<Avatar src={'data:image/jpeg;base64,' + row.avatar}/>}
                            title={decrypt(row.username)}
                            description={row.invitation.description}
                        />
                    </Skeleton>
                </List.Item>)
            },this)}
        </List>
        /*
        <List
            className="demo-loadmore-list"
            //loading={initLoading}
            itemLayout="horizontal"
            //loadMore={loadMore}
            dataSource={data}
            renderItem={(item) => (
                <List.Item
                    actions={[<a key="list-loadmore-edit" onClick={accept}>accept</a>, <a key="list-loadmore-more" onClick={reject}>reject</a>]}
                >
                    <Skeleton avatar title={false} loading={item.loading} active>
                        <List.Item.Meta
                            //avatar={<Avatar src={item.picture.large} />}
                            title={item.userId}
                            description={item.description}
                        />
                    </Skeleton>
                </List.Item>
            )}
        />

         */
    );
};

export default InvitationList;
