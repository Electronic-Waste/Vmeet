package com.example.backend.repository;

import com.example.backend.entity.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.persistence.criteria.CriteriaBuilder;
import java.util.List;

public interface InvitationRepository extends JpaRepository<Invitation, Integer> {
    @Query(value = "select i from Invitation i where i.userId=:userId and i.status=:status")
    List<Invitation> getSentInvitations(@Param(value = "userId") int userId, @Param(value = "status") int status);

    @Query(value = "select i from Invitation i where i.friendId=:friendId and i.status=:status")
    List<Invitation> getReceivedInvitations(@Param(value = "friendId") int friendId, @Param(value = "status") int status);

    @Query(value = "select i from Invitation i where i.userId=:userId and i.friendId=:friendId and i.status=:status")
    Invitation getInvitationByUserIdAndInvitationIdAndStatus(
            @Param(value = "userId") int userId, @Param(value = "friendId") int friendId, @Param(value = "status") int status
    );
}
