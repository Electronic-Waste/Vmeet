import {getUid} from "./cookie";

export let websocket = null;

export function createWebSocket () {
    const uid = getUid();
    websocket = new WebSocket(`wss://121.37.176.107/websocket/${uid}`)

    websocket.onopen = function () {
        console.log("连接成功")
    }

    websocket.onmessage = function (event) {
        console.log("后台数据: " + event.data)
    }

    websocket.onclose = function () {
        console.log("关闭连接")
    }

    websocket.onerror = function () {
        console.log("发生错误")
    }
}

export function openWebSocket (uid) {
    websocket = new WebSocket(`wss://121.37.176.107:8080/websocket/${uid}`)
    // websocket = new WebSocket(`ws://localhost:8080/websocket/${uid}`)

    websocket.onopen = function () {
        console.log(uid + "connected!")
    }

    websocket.onclose = function () {
        console.log(uid + "disconnected")
    }

    websocket.onerror = function () {
        console.log(uid + "connection error")
    }
}
