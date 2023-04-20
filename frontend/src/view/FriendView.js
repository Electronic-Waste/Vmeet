import React, {useState} from 'react';
import 'antd/dist/antd.css';
import '../css/friend.css';
import { UploadOutlined, UserOutlined, VideoCameraOutlined, CommentOutlined} from '@ant-design/icons';
import {Layout, Menu, MenuProps} from 'antd';
import {FriendContent} from "../components/FriendContent";
import {HeadBar} from "../components/HeadBar";
import {LeftSideBar, MidSideBar} from "../components/SideBar";
import "../css/group.css"
import {GroupPage} from "../components/GroupPage";

const { Header, Content, Footer, Sider } = Layout;

const mes = ["friend","group"];
const friMes = ["thunderman","Semo"]

function FriendView() {

    const [selectId,setSelectId] = useState(null);
    const [friendList,setFriendList] = useState([]);

    const onClick: MenuProps['onClick'] = e => {
        console.log('click ', e);
        console.log(e.key);

        setSelectId(e.key);
    };

    return (
        <Layout>
            <HeadBar/>
            <Layout>
                <LeftSideBar/>
                <MidSideBar type={"friend"} requireCallback={true} onClick={onClick} setFriendList={setFriendList}/>
                <Layout style={{padding: '0 24px 24px'}}>
                    {/*Replace the following line with your implementation*/}
                    <FriendContent select={selectId} friendList={friendList}/>
                </Layout>
            </Layout>
        </Layout>
    );

}

export default FriendView;
