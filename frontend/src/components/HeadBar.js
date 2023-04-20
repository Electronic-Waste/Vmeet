import React, {useEffect, useState} from "react";
import {
    MessageOutlined,
    ProfileOutlined,
    SettingOutlined,
    TeamOutlined,
    UserAddOutlined, UsergroupAddOutlined,
    UserOutlined, WechatOutlined
} from "@ant-design/icons";
import {Menu, Layout, Input, Avatar,Modal, Row, Col, Typography} from "antd";
import {getItem} from "../service/CreateItem";
import "../css/bar.css"
import {useNavigate} from "react-router-dom";
import {getUid} from "../utils/cookie";
import {createWebSocket,websocket} from "../utils/websocket";
import {AuthConsumer} from "../utils/Auth";
import UserInfoPage from "./UserInfoPage";
import FriendInvitationView from "../view/FriendInvitationView";
import {AddFriend2} from "./AddFriend";
import {CreateGroup} from "./CreateGroup";
import {decrypt} from "../service/SecurityService";

const { Header } = Layout;
const { Search } = Input
const {Text} = Typography;

/**
 * This component renders the headBar of the page
 */
export function HeadBar(props){
    const auth = AuthConsumer();
    const navigate = useNavigate();
    const uid = getUid();
    const userjson = localStorage.getItem('user' + uid);
    const user = JSON.parse(userjson);
    const url = user['avatar'];
    const username = decrypt(user['username']);
    const [friendMessageShow,ifshowFriMes] = useState(false);
    const [addFriModal,ifshowAddFri] = useState(false);
    const [createGrp,ifshowGrp] = useState(false)

    const items = [
        getItem('About Vmeet', 'sub0', null, null),
        // getItem('Me', 'sub1', <UserOutlined/>, [
        //     getItem("My Profile", "sub1child1", <ProfileOutlined/>, null),
        //     getItem("Settings", "sub1child2", <SettingOutlined />, null)
        // ]),
        getItem('Message', 'sub2', <MessageOutlined/>, [
            getItem("Friend requests", 'sub2child1', <TeamOutlined/>, null),
            getItem("Group Invitations", 'sub2child2', <TeamOutlined/>, null)

            /*
            getItem("Group Invitation From Wyw", 'sub2child1', <TeamOutlined/>, null),
            getItem("Group Invitaion From Sjq", "sub2child2", <TeamOutlined/>, null),
            getItem("Group Invitaion From Wjl", "sub2child3", <TeamOutlined/>, null)

             */
        ]),
        getItem('Add', 'sub3', <UserAddOutlined/>, [
            getItem("Add Friends", 'sub3child1', <UserAddOutlined/>, null),
            //getItem("Add Groups", "sub3child2", <UsergroupAddOutlined/>, null),
            getItem("Create Group", "sub3child3", <TeamOutlined />, null),
        ])
    ];

    const clickMenuItem = ({ item, key, keyPath, domEvent }) => {
        if (key === "sub1child1") {
            // navigate(`/${uid}/UserInfoView`);
            showModal();
        }
        else if (key === "sub2child1") {
            // navigate(`/${uid}/FriendInvitationView`);
            ifshowFriMes(true)
        }
        else if (key === "sub3child1") {
            // navigate(`/${uid}/AddFriendView2`);
            ifshowAddFri(true)
        }
        else if (key === "sub3child3") {
            // navigate(`/${uid}/CreateGroupView`);
            ifshowGrp(true)
        }
        // else if (key === "sub0") {
        //     navigate(`/${uid}/ChatExcelView`);
        // }
    }

    const clickLogo = (e) => {
        navigate(`/${uid}/FriendView`);
    }
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSearch = (e) => {
        auth.Search(e);
    }

    const clickUser = () => {
        navigate(`/${uid}/UserInfoView`);
    }

    return (
        <Header className="header">
            <WechatOutlined className="header-logo" onClick={clickLogo}/>
            <h1 className="header-logo-text" onClick={clickLogo}>VMeet</h1>
                {/*<Col push={4}>*/}
                {/*    <form>*/}
                {/*        <input type="text" placeholder="请输入您要搜索的内容..."/>*/}
                {/*        /!*<button type="submit"/>*!/*/}
                {/*    </form>*/}
                {/*</Col>*/}
            <Search
                className="header-search"
                placeholder="search friends/groups"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={handleSearch}
            />
            <Text className="header-username" onClick={()=>setIsModalVisible(true)}>{username}</Text>
            <Avatar className="header-avatar" src={url} onClick={()=>setIsModalVisible(true)} size={40}/>
            <Menu className="header-menu" theme="dark" mode="horizontal" items={items} onClick={clickMenuItem}/>
            <Modal title="个人信息" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <UserInfoPage/>
            </Modal>

            <Modal title="Friend Request" visible={friendMessageShow} onOk={()=>ifshowFriMes(false)}>
                <FriendInvitationView/>
            </Modal>
            <Modal title="Add Friends" visible={addFriModal} footer={null} onOk={()=>ifshowAddFri(false)}>
                <AddFriend2 setVisible={ifshowAddFri}/>
            </Modal>
            <Modal title="Create Group" visible={createGrp} footer={null} onOk={()=>ifshowGrp(false)}>
                <CreateGroup setVisible={ifshowGrp}/>
            </Modal>
        </Header>
    );

}
