package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "group_msg")
@JsonIgnoreProperties(value = {"handler","hibernateLazyInitializer","fieldHandler"})
public class GroupMsg {
    @Id
    @Column(name = "msg_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "msg_time")
    @CreatedDate
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Timestamp time;

    @Column(name = "msg_user_id")
    private int userId;

    @Column(name = "msg_group_id")
    private int groupId;

    @Lob
    @Column(name = "msg_content", columnDefinition = "text")
    private String content;
}
