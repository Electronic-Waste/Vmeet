package com.example.backend.serviceimpl;

import com.example.backend.dao.FriendDao;
import com.example.backend.entity.Friend;
import com.example.backend.entity.Invitation;
import com.example.backend.entity.User;
import com.example.backend.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.config.CustomRepositoryImplementationDetector;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class FriendServiceImpl implements FriendService {
    @Autowired
    FriendDao friendDao;

    @Override
    public List<User> getFriends(int userId) {
        return friendDao.getFriendsInfo(userId);
    }

    @Override
    public List<Friend> getFriendListAsRoomId(int userId) {
       return friendDao.getFriendsListAsRoomId(userId);
    }

    @Override
    public List<Invitation> getSentInvitations(int userId, int status) {
        return friendDao.getSentInvitations(userId, status);
    }

    @Override
    public List<Invitation> getReceivedInvitations(int friendId, int status) {
        return friendDao.getReceivedInvitations(friendId, status);
    }

    @Override
    public boolean acceptInvitation(int invitationId) {
        try {
            /* Get invitation */
            Invitation invitation = friendDao.getInvitation(invitationId);
            /* Update invitation */
            invitation.setStatus(1);            // accept state
            friendDao.saveInvitation(invitation);

            /* Update friend */
            Friend friend = new Friend();
            friend.setUserId(invitation.getUserId());
            friend.setFriendId(invitation.getFriendId());
            friendDao.saveFriend(friend);

            /* Update inverse friend */
//            Friend inv_friend = new Friend();
//            inv_friend.setUserId(invitation.getFriendId());
//            inv_friend.setFriendId(invitation.getUserId());
//            friendDao.saveFriend(inv_friend);

            return true;
        } catch (EntityNotFoundException e) {
            return false;
        }
    }

    @Override
    public boolean rejectInvitation(int invitationId) {
        try {
            Invitation invitation = friendDao.getInvitation(invitationId);
            invitation.setStatus(2);            // reject state
            friendDao.saveInvitation(invitation);
            return true;
        } catch (EntityNotFoundException e) {
            return false;
        }
    }

    @Override
    public int saveFriend(Map<String, String> params) {
        Friend friend = new Friend();
        friend.setUserId(Integer.parseInt(params.get("userId")));
        friend.setFriendId(Integer.parseInt(params.get("friendId")));
        return friendDao.saveFriend(friend);
    }

    @Override
    public void deleteFriend(int userId, int friendId) {
        /* Delete friend */
        Friend friend = friendDao.getFriend(userId, friendId);
        friendDao.deleteFriend(friend.getId());

        /* Update corresponding invitation */
        Invitation invitation = friendDao.getInvitationByUserIdAndFriendIdAndStatus(userId, friendId, 1);   // 1: accepted
        invitation.setStatus(3);    // 3: deleted
        friendDao.saveInvitation(invitation);
    }

    @Override
    public int saveInvitation(Map<String, String> params) {
        Invitation invitation = new Invitation();
        invitation.setUserId(Integer.parseInt(params.get("userId")));
        invitation.setFriendId(Integer.parseInt(params.get("friendId")));
        invitation.setDescription(params.get("description"));
        invitation.setStatus(0);
        return friendDao.saveInvitation(invitation);
    }
}
