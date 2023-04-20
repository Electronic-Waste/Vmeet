package com.example.backend.service;

import com.alibaba.fastjson2.JSONObject;
import com.example.backend.entity.FriendMsg;
import com.example.backend.entity.Group;
import com.example.backend.entity.GroupMsg;
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

import static org.junit.jupiter.api.Assertions.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class MessageServiceTest {
    @Autowired
    UserService userService;

    @Autowired
    GroupService groupService;

    @Autowired
    MessageService messageService;

    private List<User> userList = new ArrayList<>();

    private List<Group> groupList = new ArrayList<>();

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

        /* Data source: group */
        for (int i = 0; i < 10; ++i) {
            JSONObject params = new JSONObject();
            String groupName = String.valueOf(i);
            int groupAdmin = userList.get(i).getId();

            /* Insert to database */
            params.put("groupName", groupName);
            params.put("groupAdmin", groupAdmin);
            params.put("groupDescription", null);
            params.put("groupIcon", null);
            int result = groupService.createGroup(params);
            groupService.addGroupMember(result, groupAdmin);

            /* Update groupList */
            Group group = new Group();
            group.setGroupName(groupName);
            group.setGroupAdmin(groupAdmin);
            group.setGroupId(result);
            groupList.add(group);

        }

        /* Data Source: msgs */
        for (int i = 0; i < 9; ++i) {
            User user1 = userList.get(i);
            User user2 = userList.get(i + 1);
            Group group = groupList.get(i);
            int msg_from = user1.getId();
            int msg_to = user2.getId();
            int groupId = group.getGroupId();
            String content = String.valueOf(i);

            /* Insert FriendMsg */
            Map<String, String> params1 = new HashMap<>();
            params1.put("msg_from", String.valueOf(msg_from));
            params1.put("msg_to", String.valueOf(msg_to));
            params1.put("msg_content", content);
            messageService.saveFriendMsg(params1);

            /* Insert GroupMsg */
            Map<String, String> params2 = new HashMap<>();
            params2.put("userId", String.valueOf(user1.getId()));
            params2.put("groupId", String.valueOf(groupId));
            params2.put("content", content);
            messageService.saveGroupMsg(params2);
        }
    }

    @After
    public void tearDown() throws Exception {
        userList.clear();
        groupList.clear();
    }

    @Test
    @Transactional
    @Rollback(value = true)
    public void getFriendMsgByFromAndToTest() {
        /* Test */
        for (int i = 0; i < 9; ++i) {
            User user1 = userList.get(i);
            User user2 = userList.get(i + 1);
            FriendMsg result = messageService.getFriendMsgByFromAndTo(user1.getId(), user2.getId()).get(0);
            assertEquals(user1.getId(), result.getFrom());
            assertEquals(user2.getId(), result.getTo());
            assertEquals(String.valueOf(i), result.getContent());
        }
    }

    @Test
    @Transactional
    @Rollback(value = true)
    public void getGroupMsgByGroupId() {
        /* Test */
        for (int i = 0; i < 9; ++i) {
            User user = userList.get(i);
            Group group = groupList.get(i);
            GroupMsg result = messageService.getGroupMsgByGroupId(group.getGroupId()).get(0);
            assertEquals(user.getId(), result.getUserId());
            assertEquals(group.getGroupId(), result.getGroupId());
            assertEquals(String.valueOf(i), result.getContent());
        }
    }
}
