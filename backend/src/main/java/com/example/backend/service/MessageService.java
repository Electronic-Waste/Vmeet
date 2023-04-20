package com.example.backend.service;

import com.example.backend.entity.FriendMsg;
import com.example.backend.entity.GroupMsg;

import java.util.List;
import java.util.Map;

public interface MessageService {
    List<FriendMsg> getFriendMsgByFromAndTo(int userId, int friendId);

    List<GroupMsg> getGroupMsgByGroupId(int groupId);

    boolean saveFriendMsg(Map<String, String> params);

    boolean saveGroupMsg(Map<String, String> params);
}
