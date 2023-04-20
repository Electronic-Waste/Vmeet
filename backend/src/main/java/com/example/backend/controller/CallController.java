package com.example.backend.controller;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.example.backend.entity.Call;
import com.example.backend.service.CallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class CallController {
    @Autowired
    CallService callService;

    /**
     * Get call logs
     * @param params composed of "from"(int: userId), "to"(int: userId/groupId) and "type"(String: "friend"/"group").
     * @return List<Call>: ok; badRequest: otherwise.
     */
    @RequestMapping("/get-calls")
    ResponseEntity<?> getCalls(@RequestBody Map<String, String> params) {
        int from = Integer.parseInt(params.get("from"));
        int to = Integer.parseInt(params.get("to"));
        String type = params.get("type");
        List<Call> result = callService.getCalls(from, to, type);
        if (result.size() != 0)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.badRequest().body(JSON.toJSONString("No calls"));
    }

    /***
     * Store call logs
     * @param params composed of "from"(int: {userId}), "to"(int: {userId/groupId}) and "type"(String: "friend"/"group").
     * @return Success: ok; badRequest: otherwise.
     */
    @RequestMapping("/store-calls")
    ResponseEntity<?> storeStartCalls(@RequestBody Map<String, String> params) {
        int from = Integer.parseInt(params.get("from"));
        int to = Integer.parseInt(params.get("to"));
        String type = params.get("type");
        callService.saveStartCalls(from, to, type);
        return ResponseEntity.ok(JSON.toJSONString("The call is stored successfully"));
    }
}
