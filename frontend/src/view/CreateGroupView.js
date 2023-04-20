import {Layout} from "antd";
import {HeadBar} from "../components/HeadBar";
import {LeftSideBar, MidSideBar} from "../components/SideBar";
import React from "react";
import {CreateGroup} from "../components/CreateGroup";

export function CreateGroupView () {
    return (
        <Layout>
            <HeadBar/>
            <Layout>
                <LeftSideBar/>
                <MidSideBar type="group"/>
                <Layout style={{padding: '0 24px 24px'}}>
                    {/*Replace the following line with your implementation*/}
                    <CreateGroup/>
                </Layout>
            </Layout>
        </Layout>
    );
}
