package com.tribe.backend.controller;

import com.tribe.backend.dto.group.CreateGroupRequest;
import com.tribe.backend.entity.Group;
import com.tribe.backend.service.GroupService;
import com.tribe.backend.service.BillingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;
    private final BillingService billingService;    

    @PostMapping
    public ResponseEntity<Group> createGroup(
            @Valid @RequestBody CreateGroupRequest request
    ) {
        Group group = groupService.createGroup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(group);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroup(@PathVariable UUID id) {
        return ResponseEntity.ok(groupService.getGroup(id));
    }

    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() {
        return ResponseEntity.ok(groupService.getAllGroups());
    }

    @PostMapping("/{groupId}/invoices")
    public ResponseEntity<String> generateInvoice(@PathVariable UUID groupId) {
        billingService.generateInvoice(groupId);
        return ResponseEntity.ok("Invoice generated successfully");
    }
}