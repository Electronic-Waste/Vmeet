package com.example.backend.daoimpl;

import com.example.backend.dao.GroupDao;
import com.example.backend.entity.Group;
import com.example.backend.entity.GroupMember;
import com.example.backend.entity.User;
import com.example.backend.repository.GroupMemberRepository;
import com.example.backend.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class GroupDaoImpl implements GroupDao {
    @Autowired
    GroupRepository groupRepository;

    @Autowired
    GroupMemberRepository groupMemberRepository;

    @Override
    public int saveGroup(Group group) {
        Group result = groupRepository.save(group);
        return result.getGroupId();
    }

    @Override
    public Group getGroupByGroupId(int groupId) {
        return groupRepository.getById(groupId);
    }

    @Override
    public List<Group> getGroupByUserId(int userId) {
        return groupRepository.getGroupByUserId(userId);
    }

    @Override
    public List<User> getGroupMembersByGroupId(int groupId) {
        return groupMemberRepository.getGroupMembersByGroupId(groupId);
    }

    @Override
    public List<ArrayList<String>> getGroupMemberUsernameByGroupId(int groupId) {
        return groupMemberRepository.getGroupMemberUsernameByGroupId(groupId);
    }

    @Override
    public List<Integer> getGroupMembersIdByGroupId(int groupId) {
        return groupMemberRepository.getGroupMembersIdByGroupId(groupId);
    }

    @Override
    public void saveMember(GroupMember groupMember) {
        groupMemberRepository.save(groupMember);
    }

    @Override
    public void saveMembers(List<GroupMember> members){groupMemberRepository.saveAll(members);}

    @Override
    public void deleteMember(int groupId, int userId) {
        GroupMember groupMember = groupMemberRepository.getGroupMember(groupId, userId);
        int id = groupMember.getId();
        groupMemberRepository.deleteById(id);
    }
}
