package com.example.backend.repository;

import com.example.backend.entity.GroupMsg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GroupMsgRepository extends JpaRepository<GroupMsg, Integer> {
    @Query(value = "select msg from GroupMsg msg where msg.groupId=:groupId")
    List<GroupMsg> getGroupMsgsByGroupId(@Param(value = "groupId") int groupId);
}
