package com.tribe.backend.repository;

import com.tribe.backend.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface MemberRepository extends JpaRepository<Member, UUID> {
    List<Member> findByGroupId(UUID groupId);
}