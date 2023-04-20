package com.example.backend.repository;

import com.example.backend.entity.Group;
import com.example.backend.entity.GroupMember;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;
import java.util.List;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Integer> {
    @Query(value = "select gm from GroupMember gm where gm.groupId=:groupId and gm.userId=:userId")
    GroupMember getGroupMember(@Param(value = "groupId") int groupId, @Param(value = "userId") int userId);

    @Query(value = "select u from User u where u.id in (select gm.userId from GroupMember gm where gm.groupId=:groupId)")
    List<User> getGroupMembersByGroupId(@Param(value = "groupId") int groupId);

    @Query(value = "select u.id, u.username from User u where u.id in (select gm.userId from GroupMember gm where gm.groupId=:groupId)")
    List<ArrayList<String>> getGroupMemberUsernameByGroupId(@Param(value = "groupId") int groupId);

    @Query(value = "select u.id from User u where u.id in (select gm.userId from GroupMember gm where gm.groupId=:groupId)")
    List<Integer> getGroupMembersIdByGroupId(@Param(value = "groupId") int groupId);
}
