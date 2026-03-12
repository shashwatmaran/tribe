package com.tribe.backend.service;

import com.tribe.backend.entity.Charge;
import com.tribe.backend.entity.Invoice;
import com.tribe.backend.entity.enums.ChargeStatus;
import com.tribe.backend.exception.ResourceNotFoundException;
import com.tribe.backend.exception.ValidationException;
import com.tribe.backend.repository.ChargeRepository;
import com.tribe.backend.repository.GroupRepository;
import com.tribe.backend.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ChargeService {

    private final ChargeRepository chargeRepository;
    private final InvoiceRepository invoiceRepository;
    private final GroupRepository groupRepository;

    public Charge getCharge(UUID chargeId) {
        return chargeRepository.findById(chargeId)
                .orElseThrow(() -> new ResourceNotFoundException("Charge not found with ID: " + chargeId));
    }

    public List<Charge> getGroupCharges(UUID groupId) {
        // Verify group exists
        groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with ID: " + groupId));

        // Get all invoices for group
        List<Invoice> invoices = invoiceRepository.findByGroupId(groupId);
        
        // Get all charges from all invoices
        List<Charge> allCharges = invoices.stream()
                .flatMap(invoice -> chargeRepository.findByInvoiceId(invoice.getId()).stream())
                .toList();
        
        return allCharges;
    }

    public Charge retryCharge(UUID chargeId) {
        Charge charge = getCharge(chargeId);

        // Only FAILED charges can be retried
        if (!charge.getStatus().equals(ChargeStatus.FAILED)) {
            throw new ValidationException("Only failed charges can be retried. Current status: " + charge.getStatus());
        }

        // Reset charge to PENDING for retry
        charge.setStatus(ChargeStatus.PENDING);
        charge = chargeRepository.save(charge);

        return charge;
    }
}
