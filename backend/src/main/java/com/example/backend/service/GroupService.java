package com.example.backend.service;

import com.alibaba.fastjson2.JSONObject;
import com.example.backend.entity.Group;
import com.example.backend.entity.GroupMember;
import com.example.backend.entity.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public interface GroupService {
    /* return: the groupId of newly created group */
    int createGroup(JSONObject params);

    List<Group> getGroupByUserId(int userId);

    List<User> getGroupMembersByGroupId(int groupId);

    List<Integer> getGroupMembersIdByGroupId(int groupId);

    List<ArrayList<String>> getGroupMemberUsernameByGroupId(int groupId);

    void addGroupMember(int groupId, int userId);

    void addGroupMembers(List<GroupMember> members);

    void deleteGroupMember(int groupId, int userId);

    void addGroupOnlineNum(int groupId);

    void minusGroupOnlineNum(int groupId);
}
