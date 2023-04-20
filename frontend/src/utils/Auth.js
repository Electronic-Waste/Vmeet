import React, {useState, createContext, useContext, useEffect} from "react";
import { Navigate } from 'react-router';
import {loginUser} from "./cookie";
import {createWebSocket} from "./websocket";

/**
 * 刷新特定组件：
 * 引入const auth = AuthConsumer()
 * 在被刷新的组件的useEffect的deps中包含auth.refreshed
 * 在引起刷新的部分执行auth.Refresh()
 */

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [authed, setAuthed] = useState(true);
    const [refreshed, setRefreshed] = useState(0);
    const [searchText,setSearchText] = useState('');
    const auth = {
        authed,
        login() {
            return new Promise((res) => {
                setAuthed(true);
                res();
            });
        },
        logout() {
            return new Promise((res) => {
                setAuthed(false);
                res();
            });
        },
        refreshed,
        Refresh(){
            //sleep(500).then(() => {});
            return new Promise((res) => {
                setTimeout(()=>{setRefreshed(refreshed+1);},10);
                res();
            });
        },
        searchText,
        Search(e){
            setSearchText(e);
            this.Refresh();
            //console.log(searchText);
        }
    };
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function AuthConsumer() {
    return useContext(AuthContext);
}

export function RequireAuth({ children }) {
    const { authed } = AuthConsumer();
    //console.log(authed);
    useEffect(()=>{
        const url = window.location.pathname;
        const uid = url.substring(url.indexOf('/')+1,url.lastIndexOf('/'));
        //console.log(uid);
    })

    return authed === true ? (
        children
    ) : (
        <Navigate to="/" replace />
    );
}
