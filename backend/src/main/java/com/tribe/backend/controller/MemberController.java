package com.tribe.backend.controller;

import com.tribe.backend.dto.member.AddMemberRequest;
import com.tribe.backend.entity.Member;
import com.tribe.backend.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/{groupId}/members")
    public ResponseEntity<Member> addMember(
            @PathVariable UUID groupId,
            @Valid @RequestBody AddMemberRequest request
    ) {
        Member member = memberService.addMember(groupId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(member);
    }

    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<Member>> getGroupMembers(
            @PathVariable UUID groupId
    ) {
        List<Member> members = memberService.getGroupMembers(groupId);
        return ResponseEntity.ok(members);
    }

    @DeleteMapping("/{groupId}/members/{memberId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable UUID groupId,
            @PathVariable UUID memberId
    ) {
        memberService.removeMember(groupId, memberId);
        return ResponseEntity.noContent().build();
    }
}