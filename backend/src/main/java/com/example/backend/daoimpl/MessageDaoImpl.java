package com.example.backend.daoimpl;

import com.example.backend.dao.MessageDao;
import com.example.backend.entity.FriendMsg;
import com.example.backend.entity.GroupMsg;
import com.example.backend.repository.FriendMsgRepository;
import com.example.backend.repository.GroupMsgRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MessageDaoImpl implements MessageDao {
    @Autowired
    FriendMsgRepository friendMsgRepository;

    @Autowired
    GroupMsgRepository groupMsgRepository;

    @Override
    public List<FriendMsg> getFriendMsgByFromAndTo(int userId, int friendId) {
        return friendMsgRepository.getFriendMsgByFromAndTo(userId, friendId);
    }

    @Override
    public List<GroupMsg> getGroupMsgByGroupId(int groupId) {
        return groupMsgRepository.getGroupMsgsByGroupId(groupId);
    }

    @Override
    public void saveFriendMsg(FriendMsg friendMsg) {
        friendMsgRepository.save(friendMsg);
    }

    @Override
    public void saveGroupMsg(GroupMsg groupMsg) {
        groupMsgRepository.save(groupMsg);
    }
}
