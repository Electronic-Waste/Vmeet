package com.example.backend.utils;

import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;

public class Encrypt {
    public static String toMD5(String str) {
        return DigestUtils.md5DigestAsHex(str.getBytes(StandardCharsets.UTF_8));
    }
}
