package com.example.backend.service;

import com.example.backend.entity.User;

public interface UserService {
    User findUser(String username, String password);

    User findUserByUsername(String username);

    User findUserById(int userId);

    String getUsernameById(int userId);

    int addUser(User user);
}
