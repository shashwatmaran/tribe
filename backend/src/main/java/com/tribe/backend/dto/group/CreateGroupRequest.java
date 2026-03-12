package com.tribe.backend.dto.group;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateGroupRequest {

    @NotBlank
    private String platformGroupId;

    @NotNull
    @Min(1)
    private Integer totalAmount;

    @NotNull
    @Min(1)
    private Integer memberCount;

    @NotBlank
    private String currency;
}
