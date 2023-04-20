package com.example.backend.daoimpl;

import com.example.backend.dao.UserDao;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class UserDaoImpl implements UserDao {
    @Autowired
    private UserRepository userRepository;

    @Override
    public User findUser(String username, String password) {
        return userRepository.findUser(username, password);
    }

    @Override
    public User findUserByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }

    @Override
    public User findUserById(int userId) {
        return userRepository.getById(userId);
    }

    @Override
    public String getUsernameById(int userId) {
        return userRepository.getUserNameById(userId);
    }

    @Override
    public int addUser(User user) {
        User result = userRepository.save(user);
        return result.getId();
    }

}
