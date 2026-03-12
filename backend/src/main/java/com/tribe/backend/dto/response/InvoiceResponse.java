package com.tribe.backend.dto.response;

import com.tribe.backend.entity.enums.InvoiceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponse {
    private UUID id;
    private UUID groupId;
    private Integer totalAmount;
    private InvoiceStatus status;
    private LocalDate billingDate;
    private LocalDateTime createdAt;
}
