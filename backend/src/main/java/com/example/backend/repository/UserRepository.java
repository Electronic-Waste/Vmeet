package com.example.backend.repository;

import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
    @Query(value = "from User where username = :username and password = :password")
    User findUser(@Param("username") String username, @Param("password") String password);

    User findUserByUsername(String username);

    @Query(value = "select u.username from User u where u.id=:userId")
    String getUserNameById(@Param("userId") int userId);

}
