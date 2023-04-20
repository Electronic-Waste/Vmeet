import {Avatar, Button, Layout, List, Skeleton} from 'antd';
import React, { useEffect, useState } from 'react';
import {HeadBar} from "../components/HeadBar";
import {LeftSideBar, MidSideBar} from "../components/SideBar";
import {AddFriend} from "../components/AddFriend";
import InvitationList from "../components/InvitationList";

const FriendInvitationView = () => {
    const [refresh,setRefresh] = useState(0);
    return (
                <Layout>
                    {/*<LeftSideBar/>*/}
                    {/*<MidSideBar type={"friend"} refresh={refresh}/>*/}
                    <Layout style={{padding: '0 24px 24px'}}>
                        <InvitationList setRefresh={setRefresh} refresh={refresh}/>
                    </Layout>
                </Layout>
    );
};

export default FriendInvitationView;