package com.example.backend.repository;

import com.example.backend.entity.Call;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CallRepository extends JpaRepository<Call, Integer> {
    @Query("select c from Call c where c.from=:from and c.to=:to and c.type=:type")
    List<Call> getCallsByFromAndToAndType(@Param(value = "from") int from, @Param(value = "to") int to, @Param(value = "type") String type);
}
