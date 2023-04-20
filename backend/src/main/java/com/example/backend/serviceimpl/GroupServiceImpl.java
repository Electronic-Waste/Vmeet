package com.example.backend.serviceimpl;

import com.alibaba.fastjson2.JSONObject;
import com.example.backend.dao.GroupDao;
import com.example.backend.entity.Group;
import com.example.backend.entity.GroupMember;
import com.example.backend.entity.User;
import com.example.backend.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GroupServiceImpl implements GroupService {
    @Autowired
    GroupDao groupDao;

    @Override
    public int createGroup(JSONObject params) {
        Group group = new Group();
        group.setGroupName(params.get("groupName").toString());
        group.setGroupAdmin(Integer.parseInt(params.get("groupAdmin").toString()));
        group.setGroupDescription(params.get("groupDescription").toString());
        group.setGroupIcon(null);
        group.setOnlineNum(0);
        return groupDao.saveGroup(group);
    }

    @Override
    public List<Group> getGroupByUserId(int userId) {
        return groupDao.getGroupByUserId(userId);
    }

    @Override
    public List<User> getGroupMembersByGroupId(int groupId) {
        return groupDao.getGroupMembersByGroupId(groupId);
    }

    @Override
    public List<Integer> getGroupMembersIdByGroupId(int groupId) {
        return groupDao.getGroupMembersIdByGroupId(groupId);
    }

    @Override
    public List<ArrayList<String>> getGroupMemberUsernameByGroupId(int groupId) {
        return groupDao.getGroupMemberUsernameByGroupId(groupId);
    }

    @Override
    public void addGroupMember(int groupId, int userId) {
        GroupMember groupMember = new GroupMember();
        groupMember.setGroupId(groupId);
        groupMember.setUserId(userId);

        groupDao.saveMember(groupMember);
    }
    @Override
    public void addGroupMembers(List<GroupMember> members){
        groupDao.saveMembers(members);
    }

    @Override
    public void deleteGroupMember(int groupId, int userId) {
        groupDao.deleteMember(groupId, userId);
    }

    @Override
    public void addGroupOnlineNum(int groupId) {
        Group group = groupDao.getGroupByGroupId(groupId);
        int onlineNum = group.getOnlineNum();
        group.setOnlineNum(onlineNum + 1);
        groupDao.saveGroup(group);
    }

    @Override
    public void minusGroupOnlineNum(int groupId) {
        Group group = groupDao.getGroupByGroupId(groupId);
        int onlineNum = group.getOnlineNum();
        group.setOnlineNum(onlineNum - 1);
        groupDao.saveGroup(group);
    }
}
