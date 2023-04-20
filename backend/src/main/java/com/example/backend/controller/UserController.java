package com.example.backend.controller;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;

import com.example.backend.entity.User;
import com.example.backend.service.UserService;
import com.example.backend.utils.Encrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.bind.DatatypeConverter;


@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @RequestMapping("/login")
    public User login(@RequestBody JSONObject object) {

        String username = object.get("username").toString();
        String password = Encrypt.toMD5(object.get("password").toString());        // Parse to md5

        User user = userService.findUser(username, password);
        if (user == null) {
            System.out.println("no such user");
            user = new User();
            user.setId(-1);
        }
        return user;
    }

    @RequestMapping("/register")
    public User register(@RequestBody JSONObject object) {
        System.out.println(object);
        String username = object.get("username").toString();
        String password = Encrypt.toMD5(object.get("password").toString());     // Encrypt to md5
        String email = object.get("email").toString();
        String sign = object.get("sign").toString();
        String city = object.get("city").toString();
        String province = object.get("province").toString();


        User userinfo;
        userinfo = userService.findUserByUsername(username);
        if (userinfo == null) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(password);
            user.setEmail(email);
            user.setSign(sign);
            user.setProvince(province);
            user.setCity(city);
            user.setAvatar(null);

            userService.addUser(user);
            return user;
        } else {
            userinfo.setId(-1);
            return userinfo;
        }
    }

    @RequestMapping("/uploadavatar")
    public String uploadAvatar(@RequestBody JSONObject object) {
        //System.out.println(object);
        int uid = Integer.parseInt(object.get("userId").toString());
        String base64src = object.get("avatar").toString();
        String base64 = base64src.split(",")[1];
        byte[] bytes = DatatypeConverter.parseBase64Binary(base64);
        User user = userService.findUserById(uid);
        System.out.println(user);
        user.setAvatar(bytes);
        userService.addUser(user);
        return JSON.toJSONString(JSON.toJSONString("received"));
    }

    /**
     * Get user by userId
     * @param userId user's id.
     * @return User: ok; badRequest: otherwise.
     */
    @RequestMapping("/getuser")
    public ResponseEntity<?> getUserById(@RequestParam(value = "userId") int userId) {
        User result = userService.findUserById(userId);
        if (result != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.badRequest().body(JSON.toJSONString("Can't find user"));
    }

    /**
     * Get username by userId
     * @param userId user's id
     * @return {username}: ok; badRequest: otherwise.
     */
    @RequestMapping("get-username")
    public ResponseEntity<?> getUserWithNoAvatarById(@RequestParam(value = "userId") int userId) {
        String username = userService.getUsernameById(userId);
        if (!username.isEmpty()) {
            JSONObject result = new JSONObject();
            result.put("username", username);
            return ResponseEntity.ok(result);
        }
        else return ResponseEntity.badRequest().body(JSON.toJSONString("Can't find User"));
    }

    /**
     * Get user by username.
     * @param username user's username
     * @return User (normal id): ok; User (error id): otherwise.
     */
    @RequestMapping("/getuserId")
    public ResponseEntity<?> getUserByUsername(@RequestParam(value = "username") String username) {
        User result = userService.findUserByUsername(username);
        if (result != null)
            return ResponseEntity.ok(result);
        else {
            result = new User();
            result.setId(-1);
            return ResponseEntity.ok(result);
        }
    }
}