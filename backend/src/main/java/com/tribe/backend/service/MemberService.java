package com.tribe.backend.service;

import com.tribe.backend.dto.member.AddMemberRequest;
import com.tribe.backend.entity.Group;
import com.tribe.backend.entity.Member;
import com.tribe.backend.exception.ResourceNotFoundException;
import com.tribe.backend.exception.ValidationException;
import com.tribe.backend.repository.GroupRepository;
import com.tribe.backend.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final GroupRepository groupRepository;

    @Transactional
    public Member addMember(UUID groupId, AddMemberRequest request) {

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with ID: " + groupId));

        List<Member> existingMembers = memberRepository.findByGroupId(groupId);

        if (existingMembers.size() >= group.getMemberCount()) {
            throw new ValidationException("Group member limit reached");
        }

        // Check for duplicate email in group
        if (existingMembers.stream().anyMatch(m -> m.getEmail().equalsIgnoreCase(request.getEmail()))) {
            throw new ValidationException("Email already exists in this group");
        }

        Member member = Member.builder()
                .groupId(groupId)
                .email(request.getEmail())
                .status("ACTIVE")
                .joinedAt(LocalDateTime.now())
                .build();

        return memberRepository.save(member);
    }

    public Member getMember(UUID memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with ID: " + memberId));
    }

    public List<Member> getGroupMembers(UUID groupId) {
        // Verify group exists
        groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with ID: " + groupId));
        
        return memberRepository.findByGroupId(groupId);
    }

    @Transactional
    public void removeMember(UUID groupId, UUID memberId) {
        // Verify group exists
        groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with ID: " + groupId));

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with ID: " + memberId));

        if (!member.getGroupId().equals(groupId)) {
            throw new ValidationException("Member does not belong to this group");
        }

        memberRepository.deleteById(memberId);
    }
}