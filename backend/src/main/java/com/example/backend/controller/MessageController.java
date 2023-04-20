package com.example.backend.controller;

import com.alibaba.fastjson2.JSON;
import com.example.backend.entity.FriendMsg;
import com.example.backend.entity.GroupMsg;
import com.example.backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class MessageController {
    @Autowired
    MessageService messageService;

    /**
     * Get sent/received messages with somebody
     * @param params composed of 'userId', 'friendId'.
     * @return  List<FriendMsg>: Messages exist; badRequest: otherwise.
     */
    @RequestMapping("/get-messages")
    ResponseEntity<?> getMessages(@RequestBody Map<String, Integer> params) {
        List<FriendMsg> result = messageService.getFriendMsgByFromAndTo(params.get("userId"), params.get("friendId"));
        System.out.println(result);
        if (result.size() != 0)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.badRequest().body(JSON.toJSONString("No messages found!"));
    }

    /**
     * Send message to somebody
     * @param params composed of 'msg_from', 'msg_to', 'msg_content'.
     * @return ok: successful; badRequest: otherwise.
     */
    @RequestMapping("/send-messages")
    ResponseEntity<?> sendMessages(@RequestBody Map<String, String> params) {
        boolean flag = messageService.saveFriendMsg(params);
        if (flag) return ResponseEntity.ok(JSON.toJSONString("The message is sent successfully!"));
        else return ResponseEntity.badRequest().body(JSON.toJSONString("Error!"));
    }

    /**
     * Get messages in certain group
     * @param params composed of 'groupId'.
     * @return  List<GroupMsg>: Messages exist; badRequest: otherwise.
     */
    @RequestMapping("/get-group-messages")
    ResponseEntity<?> getGroupMessages(@RequestBody Map<String, Integer> params) {
        List<GroupMsg> result = messageService.getGroupMsgByGroupId(params.get("groupId"));
        if (result.size() != 0)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.badRequest().body(JSON.toJSONString("No messages found!"));
    }

    /**
     * Send message in a group
     * @param params composed of 'userId', 'groupId', 'content'
     * @return ok: successful; badRequest: otherwise.
     */
    @RequestMapping("/send-group-messages")
    ResponseEntity<?> sendGroupMessages(@RequestBody Map<String, String> params) {
        boolean flag = messageService.saveGroupMsg(params);
        if (flag) return ResponseEntity.ok(JSON.toJSONString("The message is sent successfully!"));
        else return ResponseEntity.badRequest().body(JSON.toJSONString("Error!"));
    }
}
