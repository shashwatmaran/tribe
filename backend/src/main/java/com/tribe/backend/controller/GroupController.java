package com.tribe.backend.controller;

import com.tribe.backend.dto.group.CreateGroupRequest;
import com.tribe.backend.entity.Group;
import com.tribe.backend.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @PostMapping
    public ResponseEntity<Group> createGroup(
            @Valid @RequestBody CreateGroupRequest request
    ) {
        Group group = groupService.createGroup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(group);
    }
}