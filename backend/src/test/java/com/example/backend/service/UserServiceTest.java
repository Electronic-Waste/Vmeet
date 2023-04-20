package com.example.backend.service;

import com.example.backend.entity.User;
import org.junit.*;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit4.SpringRunner;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserServiceTest {
    @Autowired
    UserService userService;

    private List<User> testcase = new ArrayList<>();

    @Before
    public void setUp() throws Exception {
        for (int i = 10; i < 20; ++i) {
            User user = new User();
            user.setUsername(String.valueOf(i));
            user.setPassword(String.valueOf(i));
            int result = userService.addUser(user);
            user.setId(result);
            testcase.add(user);
        }
    }

    @After
    public void tearDown() throws Exception {
        testcase.clear();
    }

    @Test
    @Transactional
    @Rollback(value = true)
    public void findUserTest() {
        for (int i = 10; i < 20; ++i) {
            User user = userService.findUser(String.valueOf(i), String.valueOf(i));
            assertEquals(user.getId(), testcase.get(i-10).getId());
            assertEquals(user.getUsername(), testcase.get(i-10).getUsername());
            assertEquals(user.getPassword(), testcase.get(i-10).getPassword());
        }
    }

    @Test
    @Transactional
    @Rollback(value = true)
    public void findUserByUsernameTest() {
        for (int i = 10; i < 20; ++i) {
            User user = userService.findUserByUsername(String.valueOf(i));
            assertEquals(user.getId(), testcase.get(i-10).getId());
            assertEquals(user.getUsername(), testcase.get(i-10).getUsername());
            assertEquals(user.getPassword(), testcase.get(i-10).getPassword());
        }
    }

    @Test
    @Transactional
    @Rollback(value = true)
    public void findUserByIdTest() {
        for (int i = 10; i < 20; ++i) {
            User user = userService.findUserById(testcase.get(i-10).getId());
            assertEquals(user.getId(), testcase.get(i-10).getId());
            assertEquals(user.getUsername(), testcase.get(i-10).getUsername());
            assertEquals(user.getPassword(), testcase.get(i-10).getPassword());
        }
    }
}
