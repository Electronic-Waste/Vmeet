package com.example.backend.repository;

import com.example.backend.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Integer> {
    @Query(value = "select g from Group g where g.groupId in (select gm.groupId from GroupMember gm where gm.userId=:userId)")
    List<Group> getGroupByUserId(@Param(value = "userId") int userId);
}
