package com.example.backend.dao;

import com.example.backend.entity.Call;

import java.util.List;

public interface CallDao {
    List<Call> getCalls(int from, int to, String type);

    int saveStartCalls(Call call);
}
