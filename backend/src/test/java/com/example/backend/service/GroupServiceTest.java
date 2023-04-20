package com.example.backend.service;

import com.alibaba.fastjson2.JSONObject;
import com.example.backend.entity.Group;
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
import static org.junit.jupiter.api.Assertions.assertFalse;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class GroupServiceTest {
    @Autowired
    UserService userService;

    @Autowired
    GroupService groupService;

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
    }

    @After
    public void tearDown() throws Exception {
        userList.clear();
        groupList.clear();
    }

    @Test
    @Transactional
    @Rollback(value = true)
    public void getGroupByUserIdTest() {
        /* Test */
        for (int i = 0; i < 10; ++i) {
            User user = userList.get(i);
            Group result = groupService.getGroupByUserId(user.getId()).get(0);
            assertEquals(groupList.get(i).getGroupId(), result.getGroupId());
            assertEquals(String.valueOf(i), result.getGroupName());
            assertEquals(groupList.get(i).getGroupAdmin(), result.getGroupAdmin());
        }
    }

    @Test
    @Transactional
    @Rollback(value = true)
    public void getGroupMembersByGroupId() {
        /* Data Source: GroupMember */
        Group group = groupList.get(0);
        int groupId = group.getGroupId();
        groupService.addGroupMember(groupId, userList.get(1).getId());
        groupService.deleteGroupMember(groupId, userList.get(1).getId());

        /* Test */
        User user = groupService.getGroupMembersByGroupId(groupId).get(0);
        assertEquals(userList.get(0).getId(), user.getId());
    }
}
