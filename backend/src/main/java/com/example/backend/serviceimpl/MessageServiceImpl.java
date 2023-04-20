package com.example.backend.serviceimpl;

import com.example.backend.dao.MessageDao;
import com.example.backend.entity.FriendMsg;
import com.example.backend.entity.GroupMsg;
import com.example.backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class MessageServiceImpl implements MessageService {
    @Autowired
    MessageDao messageDao;

    @Override
    public List<FriendMsg> getFriendMsgByFromAndTo(int userId, int friendId) {
        return messageDao.getFriendMsgByFromAndTo(userId, friendId);
    }

    @Override
    public List<GroupMsg> getGroupMsgByGroupId(int groupId) {
        return messageDao.getGroupMsgByGroupId(groupId);
    }

    @Override
    public boolean saveFriendMsg(Map<String, String> params) {
        FriendMsg friendMsg = new FriendMsg();
        friendMsg.setFrom(Integer.parseInt(params.get("msg_from")));
        friendMsg.setTo(Integer.parseInt(params.get("msg_to")));
        friendMsg.setContent(params.get("msg_content"));
        friendMsg.setTime(new Timestamp(new Date().getTime()));
        messageDao.saveFriendMsg(friendMsg);

        return true;
    }

    @Override
    public boolean saveGroupMsg(Map<String, String> params) {
        GroupMsg groupMsg = new GroupMsg();
        groupMsg.setUserId(Integer.parseInt(params.get("userId")));
        groupMsg.setGroupId(Integer.parseInt(params.get("groupId")));
        groupMsg.setContent(params.get("content"));
        groupMsg.setTime(new Timestamp(new Date().getTime()));
        messageDao.saveGroupMsg(groupMsg);

        return true;
    }
}
