package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "invitation")
@JsonIgnoreProperties(value = {"handler","hibernateLazyInitializer","fieldHandler"})
public class Invitation {
    @Id
    @Column(name = "invitation_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int invitationId;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "friend_id")
    private int friendId;

    @Column(name = "description")
    private String description;

    @Column(name = "status")
    private int status;             // 0: pending 1: accepted 2: rejected 3: deleted+

    //@ManyToOne(fetch = FetchType.LAZY,optional = false)
    //@JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false,insertable=false,updatable=false)
    //private User user;

    //public int getUserId(){return userId;}
}
