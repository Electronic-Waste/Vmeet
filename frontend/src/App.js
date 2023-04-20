import React from 'react';
import './App.css';
import {routes} from "./router";
import {useRoutes} from "react-router-dom";
import {AuthProvider, RequireAuth} from "./utils/Auth";
import AppContextProviders from "./model/index.tsx";
import {getUid} from "./utils/cookie";
import {createWebSocket} from "./utils/websocket";

function App(){

    return (
        <AppContextProviders>
            <AuthProvider>
                {useRoutes(routes)}
            </AuthProvider>
        </AppContextProviders>
    );
}

export default App;

