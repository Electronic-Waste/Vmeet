package com.example.backend.dao;

import com.example.backend.entity.User;

public interface UserDao {
    User findUser(String username, String password);

    User findUserByUsername(String username);

    User findUserById(int userId);

    String getUsernameById(int userId);

    int addUser(User user);
}
