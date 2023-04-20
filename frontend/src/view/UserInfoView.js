import {Layout, Input, Skeleton} from 'antd';
import {HeadBar} from "../components/HeadBar";
import {LeftSideBar} from "../components/SideBar";
import UserInfoPage from "../components/UserInfoPage";
import React from 'react';
import "../css/bar.css"
import "../css/userInfo.css"

const { Search } = Input;
const { Header, Content, Sider } = Layout;

export function UserInfoView () {
        return (
                <Layout>
                    {/*<LeftSideBar/>*/}
                    {/*<MidSideBar/>*/}
                    <Layout style={{padding: '0 24px 24px'}}>
                        {/*Replace the following line with your implementation*/}
                        <UserInfoPage/>
                        <Skeleton />
                    </Layout>
                </Layout>
        );
}
