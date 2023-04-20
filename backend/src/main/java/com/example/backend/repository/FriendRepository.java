package com.example.backend.repository;

import com.example.backend.entity.Friend;
import com.example.backend.entity.Invitation;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface FriendRepository extends JpaRepository<Friend, Integer> {
    @Query(value = "select u from User u where u.id in (select f.friendId from Friend f where f.userId = :userId) or u.id in (select f.userId from Friend f where f.friendId=:userId)")
    List<User> getFriendsInfo(@Param("userId") int userId);

    @Query(value = "select f from Friend f where (f.userId=:userId and f.friendId=:friendId) or (f.userId=:friendId and f.friendId=:userId)")
    Friend getFriendByUserIdAndFriendId(@Param("userId") int userId, @Param("friendId") int friendId);

    @Query(value = "select f from Friend f where f.userId=:userId or f.friendId=:userId")
    List<Friend> getFriendListAsRoomId(@Param("userId") int userId);
}

