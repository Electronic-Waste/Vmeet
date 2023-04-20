package com.example.backend.repository;

import com.example.backend.entity.FriendMsg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FriendMsgRepository extends JpaRepository<FriendMsg, Integer> {
    @Query(value = "select m from FriendMsg m where (m.from=:userId and m.to=:friendId) or (m.from=:friendId and m.to=:userId)")
    List<FriendMsg> getFriendMsgByFromAndTo(@Param(value = "userId") int userId, @Param(value = "friendId") int friendId);
}
