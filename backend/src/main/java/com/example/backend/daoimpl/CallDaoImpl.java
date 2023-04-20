package com.example.backend.daoimpl;

import com.example.backend.dao.CallDao;
import com.example.backend.entity.Call;
import com.example.backend.repository.CallRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CallDaoImpl implements CallDao {
    @Autowired
    CallRepository callRepository;

    @Override
    public List<Call> getCalls(int from, int to, String type) {
        return callRepository.getCallsByFromAndToAndType(from, to, type);
    }

    @Override
    public int saveStartCalls(Call call) {
        Call result = callRepository.save(call);
        return result.getId();
    }
}
