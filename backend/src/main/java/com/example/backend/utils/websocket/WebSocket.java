package com.example.backend.utils.websocket;

import com.example.backend.entity.User;
import com.example.backend.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.alibaba.fastjson2.JSONArray;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;

import javax.persistence.criteria.CriteriaBuilder;
import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@ServerEndpoint(value = "/websocket/{userId}")
public class WebSocket {
    private static int onlineCount = 0;
    private static Map<Integer, WebSocket> clients = new ConcurrentHashMap<Integer, WebSocket>();
    private Session session;
    private int userId;

    @OnOpen
    public void onOpen(@PathParam("userId") int userId, Session session) throws IOException {
        this.userId = userId;
        this.session = session;

        addOnlineCount();
        clients.put(userId, this);
        System.out.println(userId + " connected!");
        System.out.println("Online Count: " + onlineCount);
    }

    @OnClose
    public void onClose() throws IOException {
        clients.remove(userId);
        subOnlineCount();
        System.out.println(userId + " disconnected!");
        System.out.println("Online Count: " + onlineCount);
    }

    @OnMessage
    public void onMessage(String message) throws IOException {
        System.out.println("receive: " + message);
        System.out.println(clients);
        /* Parse message from string to json */
        JSONObject msg = JSONObject.parseObject(message);
        String target = msg.getString("target");
        String task = msg.getString("task");
        int from = Integer.parseInt(msg.getString("from"));
        int to = Integer.parseInt(msg.getString("to"));

        /* Send request to corresponding client */
        JSONObject response = new JSONObject();
        response.put("target", target);
        response.put("task", task);
        /* Group-chat */
        if (target.equals("group-chat")) {
            JSONArray idList = msg.getJSONArray("members");
            for (int i = 0; i < idList.size(); ++i) {
                int memberId = Integer.parseInt(idList.get(i).toString());
                if (memberId != from)
                    sendMsgTo(response.toJSONString(), memberId);
            }
        }
        else sendMsgTo(response.toJSONString(), to);
        System.out.println("Online Count: " + onlineCount);
//        sendMsgTo(message, 2);

    }

    @OnError
    public void onError(Session session, Throwable error) {
        error.printStackTrace();
    }

    public void sendMsgTo(String message, int userId) throws IOException {
        for (WebSocket item : clients.values()) {
            if (item.userId == userId) {
                item.session.getAsyncRemote().sendText(message);
            }
        }
    }

    public static synchronized int getOnlineCount() {
        return onlineCount;
    }

    public static synchronized void addOnlineCount() {
        WebSocket.onlineCount++;
    }

    public static synchronized void subOnlineCount() {
        WebSocket.onlineCount--;
    }

    public static synchronized Map<Integer, WebSocket> getClients() {
        return clients;
    }

}
