package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "group_list")
@JsonIgnoreProperties(value = {"handler","hibernateLazyInitializer","fieldHandler"})
public class Group {
    @Id
    @Column(name = "group_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int groupId;

    @Column(name = "group_name")
    private String groupName;

    @Column(name = "group_admin")
    private int groupAdmin;

    @Column(name = "group_icon")
    private byte[] groupIcon;

    @Column(name = "group_description")
    private String groupDescription;

    @Column(name = "online_num")
    private int onlineNum;
}
