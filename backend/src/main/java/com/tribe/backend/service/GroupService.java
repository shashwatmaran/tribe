package com.tribe.backend.service;

import com.tribe.backend.dto.group.CreateGroupRequest;
import com.tribe.backend.entity.Group;
import com.tribe.backend.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;

    public Group createGroup(CreateGroupRequest request) {

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
}
