package com.example.backend.daoimpl;

import com.example.backend.dao.FriendDao;
import com.example.backend.dao.UserDao;
import com.example.backend.entity.Friend;
import com.example.backend.entity.Invitation;
import com.example.backend.entity.User;
import com.example.backend.repository.FriendRepository;
import com.example.backend.repository.InvitationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class FriendDaoImpl implements FriendDao {
    @Autowired
    FriendRepository friendRepository;

    @Autowired
    InvitationRepository invitationRepository;

    @Override
    public Invitation getInvitation(int invitationId) {
        return invitationRepository.getById(invitationId);
    }

    @Override
    public Invitation getInvitationByUserIdAndFriendIdAndStatus(int userId, int friendId, int status) {
        return invitationRepository.getInvitationByUserIdAndInvitationIdAndStatus(userId, friendId, status);
    }

    @Override
    public List<User> getFriendsInfo(int userId) {
        return friendRepository.getFriendsInfo(userId);
    }

    @Override
    public List<Friend> getFriendsListAsRoomId(int userId) {
        return friendRepository.getFriendListAsRoomId(userId);
    }

    @Override
    public Friend getFriend(int userId, int friendId) {
        return friendRepository.getFriendByUserIdAndFriendId(userId, friendId);
    }

    @Override
    public List<Invitation> getSentInvitations(int userId, int status) {
        return invitationRepository.getSentInvitations(userId, status);
    }

    @Override
    public List<Invitation> getReceivedInvitations(int friendId, int status) {
        return invitationRepository.getReceivedInvitations(friendId, status);
    }

    @Override
    public int saveFriend(Friend friend) {
        Friend result = friendRepository.save(friend);
        return result.getId();
    }

    @Override
    public void deleteFriend(int id) {
        friendRepository.deleteById(id);
    }

    @Override
    public int saveInvitation(Invitation invitation) {
        Invitation result = invitationRepository.save(invitation);
        return result.getInvitationId();
    }
}
