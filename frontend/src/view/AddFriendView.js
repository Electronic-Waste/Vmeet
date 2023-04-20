import { LaptopOutlined, NotificationOutlined, UserOutlined, WechatOutlined } from '@ant-design/icons';
import {Avatar, Breadcrumb, Layout, Menu, Input, Col, Row, Button} from 'antd';
import React, {useState} from 'react';
import {HeadBar} from "../components/HeadBar";
import {LeftSideBar, MidSideBar} from "../components/SideBar.js";
import {AddFriend1,AddFriend2} from "../components/AddFriend";
import "../css/group.css"

const { TextArea } = Input;
const { Header, Content, Sider } = Layout;


export function AddFriendView1  () {
    return(
        <Layout>
            <HeadBar/>
            <Layout>
                <LeftSideBar/>
                <MidSideBar type={"friend"}/>
                <Layout style={{padding: '0 24px 24px'}}>
                    <AddFriend1/>
                </Layout>
            </Layout>
        </Layout>

    );
}

export function AddFriendView2  () {
    return(
        <Layout>
            <HeadBar/>
            <Layout>
                <LeftSideBar/>
                <MidSideBar type={"friend"}/>
                <Layout style={{padding: '0 24px 24px'}}>
                    {/*Replace the following line with your implementation*/}
                    <AddFriend2/>
                </Layout>
            </Layout>
        </Layout>

    );
}
