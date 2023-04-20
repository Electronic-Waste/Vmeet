package com.example.backend.dao;

import com.example.backend.entity.Group;
import com.example.backend.entity.GroupMember;
import com.example.backend.entity.User;

import java.util.ArrayList;
import java.util.List;

public interface GroupDao {
    int saveGroup(Group group);

    Group getGroupByGroupId(int groupId);

    List<Group> getGroupByUserId(int userId);

    List<User> getGroupMembersByGroupId(int groupId);

    List<ArrayList<String>> getGroupMemberUsernameByGroupId(int groupId);

    List<Integer> getGroupMembersIdByGroupId(int groupId);

    void saveMember(GroupMember groupMember);

    void deleteMember(int groupId, int userId);

    void saveMembers(List<GroupMember> members);


}
