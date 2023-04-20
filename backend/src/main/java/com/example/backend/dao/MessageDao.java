package com.example.backend.dao;

import com.example.backend.entity.FriendMsg;
import com.example.backend.entity.GroupMsg;

import java.util.List;

public interface MessageDao {
    List<FriendMsg> getFriendMsgByFromAndTo(int userId, int friendId);

    List<GroupMsg> getGroupMsgByGroupId(int groupId);

    void saveFriendMsg(FriendMsg friendMsg);

    void saveGroupMsg(GroupMsg groupMsg);
}
