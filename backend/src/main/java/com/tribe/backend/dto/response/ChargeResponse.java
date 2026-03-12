package com.tribe.backend.dto.response;

import com.tribe.backend.entity.enums.ChargeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChargeResponse {
    private UUID id;
    private UUID invoiceId;
    private UUID memberId;
    private Integer amount;
    private ChargeStatus status;
    private LocalDateTime createdAt;
}
