package com.example.backend.serviceimpl;

import com.example.backend.dao.UserDao;
import com.example.backend.entity.User;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDao userDao;

    @Override
    public User findUser(String username, String password) {
        return userDao.findUser(username, password);
    }

    @Override
    public User findUserByUsername(String username) {
        return userDao.findUserByUsername(username);
    }

    @Override
    public User findUserById(int userId) {
        return userDao.findUserById(userId);
    }

    @Override
    public String getUsernameById(int userId) {
        return userDao.getUsernameById(userId);
    }

    @Override
    public int addUser(User user) {
        return userDao.addUser(user);
    }

}
