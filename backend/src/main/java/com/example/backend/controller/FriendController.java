package com.example.backend.controller;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.example.backend.entity.Friend;
import com.example.backend.entity.Invitation;
import com.example.backend.entity.User;
import com.example.backend.service.FriendService;
import com.example.backend.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
public class FriendController {
    @Autowired
    FriendService friendService;

    @Autowired
    UserService userService;

    /**
     * Get User's friends
     * @param userId User's id
     * @return  The list of user's friends: if result is not null; badRequest: else.
     */
    @RequestMapping("/get-friends")
    ResponseEntity<?> getFriends(@RequestParam(value = "userId") int userId) {
        List<User> result = friendService.getFriends(userId);
        System.out.println(result);
        if (result.size() != 0)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.badRequest().body(JSON.toJSONString("No friends!"));
    }

    /**
     * Get the key in friend table and set them as roomIds
     * @param userId User's id
     * @return  List<Friend>: if the result is not null; badRequest: otherwise.
     */
    @RequestMapping("/get-roomId")
    ResponseEntity<?> getRoomIdByUserId(@RequestParam(value = "userId") int userId) {
        List<Friend> result = friendService.getFriendListAsRoomId(userId);
        if (result.size() != 0)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.badRequest().body("This user does not have friend!");
    }

    /**
     * @param userId User's id (User who sent the request)
     * @param status Invitations' status(0: pending 1: accepted 2: rejected 3: deleted)
     * @return  invitations: if result is not null; badRequest: else.
     */
    @RequestMapping("/get-sent-invitations")
    ResponseEntity<?> getSentInvitations(@RequestParam(value = "userId") int userId, @RequestParam(value = "status") int status) {
        List<Invitation> result = friendService.getSentInvitations(userId, status);
        if (result.size() != 0)
            return ResponseEntity.ok(result);
        else
            return  ResponseEntity.badRequest().body(JSON.toJSONString("No invitations!"));
    }

    /**
     * @param userId User's id (User who received the request)
     * @param status Invitations' status(0: pending 1: accepted 2: rejected 3: deleted)
     * @return invitations: if result is not null; badRequest: else.
     */
    @RequestMapping("/get-received-invitations")
    ResponseEntity<?> getReceivedInvitations(@RequestParam(value = "userId") int userId, @RequestParam(value = "status") int status) {
        List<Invitation> result = friendService.getReceivedInvitations(userId, status);
        List<JSONObject> datas = new ArrayList<>();
        for (Invitation invitation : result) {
            User user = userService.findUserById(invitation.getUserId());
            String username = user.getUsername();
            JSONObject data = new JSONObject();
            data.put("invitation",invitation);
            data.put("username",username);
            datas.add(data);
        }
        if (result.size() != 0)
            return ResponseEntity.ok(datas);
        else
            return  ResponseEntity.badRequest().body(JSON.toJSONString("No invitations!"));
    }

    /**
     * Send friend request.
     * @param params composed of 'userId', 'friendId', 'description'.
     * @return  ok: friend exists; badRequest: else.
     */
    @RequestMapping("/send-friend-request")
    ResponseEntity<?> sendFriendRequest(@RequestBody Map<String, String> params) {
        User user = userService.findUserById(Integer.parseInt(params.get("userId")));
        // Check if user exists
        if (user == null)
            return ResponseEntity.badRequest().body("User doesn't exist");
        else {
            friendService.saveInvitation(params);
            return ResponseEntity.ok("The request is sent!");
        }
    }

    /**
     * Accept friend invitation.
     * @param invitationId  invitation's id.
     * @return  ok: invitation exists; badRequest: else.
     */
    @RequestMapping("/accept-invitation")
    ResponseEntity<?> acceptFriend(@RequestParam(value = "invitationId") int invitationId) {
        boolean flag = friendService.acceptInvitation(invitationId);
        if (flag) return ResponseEntity.ok(JSON.toJSONString("Accepted!"));
        else return ResponseEntity.badRequest().body(JSON.toJSONString("Invitation not found"));
    }

    /**
     * Reject friend invitation.
     * @param invitationId invitation's id.
     * @return  ok: invitation exists; badRequest: else.
     */
    @RequestMapping("/reject-invitation")
    ResponseEntity<?> rejectFriend(@RequestParam(value = "invitationId") int invitationId) {
        boolean flag = friendService.rejectInvitation(invitationId);
        if (flag) return ResponseEntity.ok(JSON.toJSONString("Rejected!"));
        else return ResponseEntity.badRequest().body(JSON.toJSONString("Invitation not found"));
    }

    /**
     * Delete friend relationship and corresponding invitation.
     * @param userId User's id.
     * @param friendId  Friend's id.
     * @return  ok: if User and Friend exists; badRequest: else.
     */
    @RequestMapping("delete-friend")
    ResponseEntity<?> deleteFriend(@RequestParam(value = "userId") int userId, @RequestParam(value = "friendId") int friendId) {
        User user = userService.findUserById(userId);
        User friend = userService.findUserById(friendId);
        if (user == null || friend == null)
            return ResponseEntity.badRequest().body(JSON.toJSONString("User or friend does not exist!"));
        else {
            friendService.deleteFriend(userId, friendId);
            return ResponseEntity.ok(JSON.toJSONString("Done!"));
        }
    }
}
