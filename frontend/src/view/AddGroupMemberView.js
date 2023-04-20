import {Layout} from "antd";
import {HeadBar} from "../components/HeadBar";
import {LeftSideBar, MidSideBar} from "../components/SideBar";
import {GroupPage} from "../components/GroupPage";
import React from "react";
import {AddGroupMember} from "../components/AddGroupMember";

export function AddGroupMemberView () {
    return (
        <Layout>
            <HeadBar/>
            <Layout>
                <LeftSideBar/>
                <MidSideBar type="group"/>
                <Layout style={{padding: '0 24px 24px'}}>
                    {/*Replace the following line with your implementation*/}
                    <AddGroupMember/>
                </Layout>
            </Layout>
        </Layout>
    );
}

