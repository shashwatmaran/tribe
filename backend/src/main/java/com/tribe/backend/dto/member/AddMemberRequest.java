package com.tribe.backend.dto.member;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddMemberRequest {

    @NotBlank
    private String email;
}