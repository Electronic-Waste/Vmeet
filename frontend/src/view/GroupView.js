import {Breadcrumb, Layout, Menu, Input, Avatar, MenuProps, Alert} from 'antd';
import {HeadBar} from "../components/HeadBar";
import {LeftSideBar, MidSideBar} from "../components/SideBar";
import {GroupPage} from "../components/GroupPage";
import React, {useEffect} from 'react';
import "../css/group.css"
import {useState} from "react";
import {AuthConsumer} from "../utils/Auth";
import {Footer} from "antd/es/layout/layout";
const { Search } = Input;
const { Header, Content, Sider } = Layout;

export function GroupView () {
    const [selectId,setSelectId] = useState(null);
    const [groupList,setGroupList] = useState([]);
    const auth = AuthConsumer();

    const onClick: MenuProps['onClick'] = e => {
        console.log('click ', e);
        console.log(e.key);

        setSelectId(e.key);
    };
    useEffect(()=>{
        setSelectId(null);
    },[auth.refreshed])

    return (
        <Layout>
            <HeadBar/>
            <Layout>
                <LeftSideBar/>
                <MidSideBar type="group" requireCallback={true} onClick={onClick} setGroupList={setGroupList}/>
                <Layout style={{padding: '0 24px 24px'}}>
                    {/*Replace the following line with your implementation*/}
                    <GroupPage select={selectId} groupList={groupList}/>
                </Layout>
            </Layout>
            <Footer/>
        </Layout>
    );

}
