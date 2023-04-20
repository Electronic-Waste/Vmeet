package com.example.backend.controller;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.example.backend.entity.Group;
import com.example.backend.entity.GroupMember;
import com.example.backend.entity.User;
import com.example.backend.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class GroupController {
    @Autowired
    GroupService groupService;

    /**
     * Create a new group
     * @param params composed of 'groupName', 'groupAdmin', 'groupIcon', 'groupDescription'
     * @return  ok: no error; badRequest: else.
     */
    @RequestMapping("/create-group")
    ResponseEntity<?> createGroup(@RequestBody JSONObject params) {
        int groupId = groupService.createGroup(params);
        int userId = Integer.parseInt(params.get("groupAdmin").toString());
        groupService.addGroupMember(groupId, userId);
        return ResponseEntity.ok("A new group is created!");
    }

    /**
     * Get user's group list
     * @param userId user's id
     * @return  List<Group>: no error; badRequest: else.
     */
    @RequestMapping("/get-group")
    ResponseEntity<?> getGroupByUserId(@RequestParam(value = "userId") int userId) {
        List<Group> result = groupService.getGroupByUserId(userId);
        return ResponseEntity.ok(result);
    }
    /**
     * Add a user to group
     * @param groupId group's id
     * @param userId user's id
     * @return ok: success; badRequest: else.
     */
    @RequestMapping("/add-group-member")
    ResponseEntity<?> addGroupMember(@RequestParam(value = "groupId") int groupId, @RequestParam(value = "userId") int userId) {
        groupService.addGroupMember(groupId, userId);
        String output = "User: " + userId + " is added to group: " + groupId;
        return ResponseEntity.ok(output);
    }

    /**
     * Add multiple users to group
     * @param object composed of groupId and userId list
     * @return ok: success; badRequest: else.
     */
    @RequestMapping("/add-group-members")
    ResponseEntity<?> addGroupMembers(@RequestBody JSONObject object) {
        System.out.println(object);
        String groupId = object.get("groupId").toString();
        JSONArray jsonarray = object.getJSONArray("userList");
        List<String> array = jsonarray.toJavaList(String.class);

        List<GroupMember> members = new ArrayList<>();
        for (String s : array) {
            GroupMember member = new GroupMember();
            member.setGroupId(Integer.parseInt(groupId));
            member.setUserId(Integer.parseInt(s));
            members.add(member);
        }
        groupService.addGroupMembers(members);

        return ResponseEntity.ok(JSON.toJSONString(array));

    }

    /**
     * Delete a member from group
     * @param groupId group's id
     * @param userId user's id
     * @return ok: success; badRequest: else.
     */
    @RequestMapping("/del-group-member")
    ResponseEntity<?> deleteGroupMember(@RequestParam(value = "groupId") int groupId, @RequestParam(value = "userId") int userId) {
        groupService.deleteGroupMember(groupId, userId);
        String output = "User: " + userId + " is deleted from group: " + groupId;
        return ResponseEntity.ok(output);
    }

    /**
     * Get members' info in a certain group
     * @param groupId group's id
     * @return List<User>: success; badRequest: else.
     */
    @RequestMapping("/get-group-member")
    ResponseEntity<?> getGroupMembers(@RequestParam(value = "groupId") int groupId) {
        List<User> result = groupService.getGroupMembersByGroupId(groupId);
        return ResponseEntity.ok(result);
    }

    /**
     * Get member's username in a certain group
     * @param groupId group's id
     * @return List<JSONObject>: ok; badRequest: otherwise.
     */
    @RequestMapping("/get-group-member-username")
    ResponseEntity<?> getGroupMembersNoAvatar(@RequestParam(value = "groupId") int groupId) {
        List<ArrayList<String>> result = groupService.getGroupMemberUsernameByGroupId(groupId);
        if (result.size() != 0) {
            int size = result.size();
            List<JSONObject> data = new ArrayList<>();
            for (int i = 0; i < size; ++i) {
                String userId = result.get(i).get(0);
                String username = result.get(i).get(1);
                JSONObject object = new JSONObject();
                object.put("id", userId);
                object.put("username", username);
                data.add(object);
            }
            return ResponseEntity.ok(data);
        }
        else return ResponseEntity.badRequest().body(JSON.toJSONString("No Group Member"));
    }

    /**
     * Update onlineNum for certain group (+1).
     * @param groupId group's id
     * @return ok: success; badRequest: otherwise.
     */
    @RequestMapping("/add-online-num")
    ResponseEntity<?> addGroupOnlineNum(@RequestParam(value = "groupId") int groupId) {
        groupService.addGroupOnlineNum(groupId);
        return ResponseEntity.ok(JSON.toJSONString("OnlineNum + 1"));
    }

    /**
     * Update onlineNum for certain group (-1)
     * @param groupId group's id
     * @return ok: success; badRequest: otherwise.
     */
    @RequestMapping("/minus-online-num")
    ResponseEntity<?> minusOnlineNum(@RequestParam(value = "groupId") int groupId) {
        groupService.minusGroupOnlineNum(groupId);
        return ResponseEntity.ok(JSON.toJSONString("OnlineNum - 1"));
    }
}
