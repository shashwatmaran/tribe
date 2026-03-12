package com.tribe.backend.service;

import com.tribe.backend.dto.group.CreateGroupRequest;
import com.tribe.backend.entity.Group;
import com.tribe.backend.exception.ResourceNotFoundException;
import com.tribe.backend.exception.ValidationException;
import com.tribe.backend.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;

    public Group createGroup(CreateGroupRequest request) {
        // Validate input
        if (request.getTotalAmount() == null || request.getTotalAmount() <= 0) {
            throw new ValidationException("Total amount must be greater than 0");
        }

        if (request.getMemberCount() == null || request.getMemberCount() <= 0) {
            throw new ValidationException("Member count must be greater than 0");
        }

        Group group = Group.builder()
                .platformGroupId(request.getPlatformGroupId())
                .totalAmount(request.getTotalAmount())
                .memberCount(request.getMemberCount())
                .currency(request.getCurrency())
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .build();

        return groupRepository.save(group);
    }

    public Group getGroup(UUID id) {
        return groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with ID: " + id));
    }

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }
}
