package com.example.backend.service;

import com.example.backend.entity.Call;

import java.util.List;

public interface CallService {
    List<Call> getCalls(int from, int to, String type);

    int saveStartCalls(int from, int to, String type);
}
