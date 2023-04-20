package com.example.backend.service;

import com.example.backend.entity.Friend;
import com.example.backend.entity.Invitation;
import com.example.backend.entity.User;

import javax.persistence.criteria.CriteriaBuilder;
import java.util.List;
import java.util.Map;


public interface FriendService {
    List<User> getFriends(int userId);

    List<Friend> getFriendListAsRoomId(int userId);

    List<Invitation> getSentInvitations(int userId, int status);

    List<Invitation> getReceivedInvitations(int friendId, int status);

    boolean acceptInvitation(int invitationId);

    boolean rejectInvitation(int invitationId);

    int saveFriend(Map<String, String> params);

    void deleteFriend(int userId, int friendId);

    int saveInvitation(Map<String, String> params);
}
