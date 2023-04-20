import React from "react";
import {Router, Route, Routes, Navigate} from "react-router"
import {BrowserRouter} from "react-router-dom";
import {LoginView} from "./view/LoginView";
import {AddFriendView1, AddFriendView2} from "./view/AddFriendView";
import {GroupView} from "./view/GroupView";
import {UserInfoView} from "./view/UserInfoView";
import FriendView from "./view/FriendView";
import {RequireAuth} from "./utils/Auth";
import {RegisterView} from "./view/RegisterView";
import {OneToOneChatView} from "./view/OneToOneChatView";
import {VtuberView} from "./view/VtuberView";
import FriendInvitationView from "./view/FriendInvitationView";
import {ChatExcelView} from "./view/ChatExcelView";
import {GroupVideoView} from "./view/GroupVideoView";
import {CreateGroupView} from "./view/CreateGroupView";
import {AddGroupMemberView} from "./view/AddGroupMemberView";

export const routes = [
    {
        path:"/",
        element:<LoginView/>
    },
    {
        path:"/register",
        element:<RegisterView/>
    },
    {
        path:"/:userid/FriendView",
        element: <RequireAuth><FriendView/></RequireAuth>
    },
    {
        path:"/:userid/GroupView",
        element:<RequireAuth><GroupView/></RequireAuth>
    },
    {
        path:"/:userid/UserInfoView",
        element:<RequireAuth><UserInfoView/></RequireAuth>
    },
    {
        path:"/:userid/AddFriendView1",
        element:<RequireAuth><AddFriendView1/></RequireAuth>
    },
    {
        path:"/:userid/AddFriendView2",
        element:<RequireAuth><AddFriendView2/></RequireAuth>
    },
    {
        path: "/:fri_id/:usertype/ChatView",
        element: <RequireAuth><OneToOneChatView/></RequireAuth>
    },
    {
        path: "/:fri_id/:usertype/VtuberView",
        element: <RequireAuth><VtuberView/></RequireAuth>
    },
    {
        path: "/:userid/FriendInvitationView",
        element: <RequireAuth><FriendInvitationView/></RequireAuth>
    },
    // {
    //     path: "/:userid/ChatExcelView",
    //     element: <RequireAuth><ChatExcelView/></RequireAuth>
    // },
    {
        path: "/:userid/GroupVideo",
        element: <GroupVideoView/>
    },
    {
        path: "/:userid/CreateGroupView",
        element: <CreateGroupView/>
    },
    {
        path: "/:userid/AddGroupMemberView",
        element: <AddGroupMemberView/>
    }
];


/*
export function BasicRoute(){
    return (
        <Routes>
            <Route path="/" element={<LoginView/>}/>
            <Route path="/:userid/FriendView" element={<RequireAuth><FriendView/></RequireAuth>}/>
            <Route path="/:userid/GroupView" element={<RequireAuth><GroupView/></RequireAuth>}/>
            <Route path="/:userid/UserInfoView" element={<RequireAuth><UserInfoView/></RequireAuth>}/>

            <Route path="/:userid/AddFriendView1" element={<RequireAuth><AddFriendView1/></RequireAuth>}/>
            <Route path="/:userid/AddFriendView2" element={<RequireAuth><AddFriendView2/></RequireAuth>}/>
            <Route path="/:userid/:usertype/ChatView" element={<RequireAuth><OneToOneChatView/></RequireAuth>}/>
            <Route path="/:userid/:usertype/VtuberView" element={<RequireAuth><VtuberView/></RequireAuth>}/>
            <Route path="/:userid/FriendInvitationView" element={<RequireAuth><FriendInvitationView/></RequireAuth>}/>
        </Routes>
    );

}

 */
