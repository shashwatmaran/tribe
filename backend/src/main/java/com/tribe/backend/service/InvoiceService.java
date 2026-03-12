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

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ChargeRepository chargeRepository;
    private final GroupRepository groupRepository;

    public Invoice getInvoice(UUID invoiceId) {
        return invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + invoiceId));
    }

    public List<Invoice> getGroupInvoices(UUID groupId) {
        // Verify group exists
        groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with ID: " + groupId));
        
        return invoiceRepository.findByGroupId(groupId);
    }

    public List<Charge> getInvoiceCharges(UUID invoiceId) {
        // Verify invoice exists
        Invoice invoice = getInvoice(invoiceId);
        return chargeRepository.findByInvoiceId(invoiceId);
    }
}
