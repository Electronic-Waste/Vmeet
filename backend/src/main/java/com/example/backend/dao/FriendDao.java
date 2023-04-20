package com.example.backend.dao;

import com.example.backend.entity.Friend;
import com.example.backend.entity.Invitation;
import com.example.backend.entity.User;

import javax.persistence.criteria.CriteriaBuilder;
import java.util.List;

public interface FriendDao {
    Invitation getInvitation(int invitationId);

    Invitation getInvitationByUserIdAndFriendIdAndStatus(int userId, int friendId, int status);

    List<User> getFriendsInfo(int userId);

    List<Friend> getFriendsListAsRoomId(int userId);

    Friend getFriend(int userId, int friendId);

    List<Invitation> getSentInvitations(int userId, int status);

    List<Invitation> getReceivedInvitations(int friendId, int status);

    int saveFriend(Friend friend);

    void deleteFriend(int id);

    int saveInvitation(Invitation invitation);
}
