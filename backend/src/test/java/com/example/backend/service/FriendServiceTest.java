package com.example.backend.service;

import com.example.backend.entity.Friend;
import com.example.backend.entity.Invitation;
import com.example.backend.entity.User;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit4.SpringRunner;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class FriendServiceTest {
    @Autowired
    FriendService friendService;

    @Autowired
    UserService userService;

    private List<User> userList = new ArrayList<>();

    private List<Friend> friendList = new ArrayList<>();

    private List<Invitation> invitationList = new ArrayList<>();

    @Before
    public void setUp() throws Exception {
        /* Data source: user */
        for (int i = 10; i < 20; ++i) {
            User user = new User();
            user.setUsername(String.valueOf(i));
            user.setPassword(String.valueOf(i));
            int result = userService.addUser(user);
            user.setId(result);
            userList.add(user);
        }

        /* Data Source: invitation */
        for (int i = 0; i < 10; i += 2) {
            Map<String, String> params = new HashMap<>();
            int userId = userList.get(i).getId();
            int friendId = userList.get(i + 1).getId();
            String description = "description";

            /* Insert to database */
            params.put("userId", String.valueOf(userId));
            params.put("friendId", String.valueOf(friendId));
            params.put("description", description);
            int result = friendService.saveInvitation(params);

            /* Update invitation list */
            Invitation invitation = new Invitation();
            invitation.setInvitationId(result);
            invitation.setUserId(userId);
            invitation.setFriendId(friendId);
            invitation.setDescription(description);
            invitation.setStatus(0);
            invitationList.add(invitation);
        }
    }

    @After
    public void tearDown() throws Exception {
        userList.clear();
        friendList.clear();
        invitationList.clear();
    }

    @Test
    @Transactional
    @Rollback(value = true)
    public void getFriendsTest() {
        /* Data source: friend */
        for (int i = 0; i < 10; i += 2) {
            Map<String, String> params = new HashMap<>();
            int userId = userList.get(i).getId();
            int friendId = userList.get(i + 1).getId();

            /* Insert to database */
            params.put("userId", String.valueOf(userId));
            params.put("friendId", String.valueOf(friendId));
            int result = friendService.saveFriend(params);

            /* Update to friendList */
            Friend friend = new Friend();
            friend.setId(result);
            friend.setUserId(userId);
            friend.setFriendId(friendId);
            friendList.add(friend);
        }

        /* Test */
        for (int i = 0; i < 10; i += 2) {
            int userId = userList.get(i).getId();
            User user = friendService.getFriends(userId).get(0);
            assertEquals(user.getId(), userList.get(i + 1).getId());
            assertEquals(user.getUsername(), userList.get(i + 1).getUsername());
            assertEquals(user.getPassword(), userList.get(i + 1).getPassword());
        }

        for (int i = 1; i < 10; i += 2) {
            int userId = userList.get(i).getId();
            User user = friendService.getFriends(userId).get(0);
            assertEquals(user.getId(), userList.get(i - 1).getId());
            assertEquals(user.getUsername(), userList.get(i - 1).getUsername());
            assertEquals(user.getPassword(), userList.get(i - 1).getPassword());
        }

    }


    @Test
    @Transactional
    @Rollback(value = true)
    public void getFriendListAsRoomIdTest() {
        /* Data source: friend */
        for (int i = 0; i < 9; i += 2) {
            Map<String, String> params = new HashMap<>();
            int userId = userList.get(i).getId();
            int friendId = userList.get(i + 1).getId();

            /* Insert to database */
            params.put("userId", String.valueOf(userId));
            params.put("friendId", String.valueOf(friendId));
            int result = friendService.saveFriend(params);

            /* Update to friendList */
            Friend friend = new Friend();
            friend.setId(result);
            friend.setUserId(userId);
            friend.setFriendId(friendId);
            friendList.add(friend);
        }

        /* Test */
        for (int i = 0; i < 9; i += 2) {
            User user = userList.get(i);
            Friend result = friendService.getFriendListAsRoomId(user.getId()).get(0);
            assertEquals(result.getUserId(), friendList.get(i / 2).getUserId());
            assertEquals(result.getFriendId(), friendList.get(i / 2).getFriendId());
        }

        for (int i = 1; i < 10; i += 2) {
            User user = userList.get(i);
            Friend result = friendService.getFriendListAsRoomId(user.getId()).get(0);
            assertEquals(result.getUserId(), friendList.get(i / 2).getUserId());
            assertEquals(result.getFriendId(), friendList.get(i / 2).getFriendId());
        }
    }

    @Test
    @Transactional
    @Rollback(value = true)
    public void getSentInvitationsTest() {
        /* Test */
        for (int i = 0; i < 10; i += 2) {
            User user = userList.get(i);
            Invitation result = friendService.getSentInvitations(user.getId(), 0).get(0);
            assertEquals(invitationList.get(i / 2).getInvitationId(), result.getInvitationId());
            assertEquals(invitationList.get(i / 2).getUserId(), result.getUserId());
            assertEquals(invitationList.get(i / 2).getFriendId(), result.getFriendId());
            assertEquals(0, result.getStatus());
        }
    }

    @Test
    @Transactional
    @Rollback(value = true)
    public void getReceivedInvitationsTest() {
        /* Test */
        for (int i = 1; i < 10; i += 2) {
            User user = userList.get(i);
            Invitation result = friendService.getReceivedInvitations(user.getId(), 0).get(0);
            assertEquals(invitationList.get(i / 2).getInvitationId(), result.getInvitationId());
            assertEquals(invitationList.get(i / 2).getUserId(), result.getUserId());
            assertEquals(invitationList.get(i / 2).getFriendId(), result.getFriendId());
            assertEquals(0, result.getStatus());
        }
    }

    @Test
    @Transactional
    @Rollback(value = true)
    public void acceptInvitationTest() {
        /* Test */
        for (int i = 0; i < 5; ++i) {
            boolean flag = friendService.acceptInvitation(invitationList.get(i).getInvitationId());
            assertTrue(flag);
        }
        for (int i = 0; i < 5; ++i) {
            boolean flag = friendService.acceptInvitation(invitationList.get(i).getInvitationId() + 5);
            assertFalse(flag);
        }
    }

    @Test
    @Transactional
    @Rollback(value = true)
    public void rejectInvitationTest() {
        /* Test */
        for (int i = 0; i < 5; ++i) {
            boolean flag = friendService.acceptInvitation(invitationList.get(i).getInvitationId());
            assertTrue(flag);
        }
        for (int i = 0; i < 5; ++i) {
            boolean flag = friendService.acceptInvitation(invitationList.get(i).getInvitationId() + 5);
            assertFalse(flag);
        }
    }
}
