package com.example.backend.serviceimpl;

import com.example.backend.dao.CallDao;
import com.example.backend.entity.Call;
import com.example.backend.service.CallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Service
public class CallServiceImpl implements CallService {
    @Autowired
    CallDao callDao;

    @Override
    public List<Call> getCalls(int from, int to, String type) {
        return callDao.getCalls(from, to, type);
    }

    @Override
    public int saveStartCalls(int from, int to, String type) {
        Call call = new Call();
        call.setFrom(from);
        call.setTo(to);
        call.setStartTime(new Timestamp(new Date().getTime()));
        call.setType(type);
        return callDao.saveStartCalls(call);
    }
}
