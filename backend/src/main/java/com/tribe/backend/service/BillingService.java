package com.tribe.backend.service;

import com.tribe.backend.entity.Charge;
import com.tribe.backend.entity.Group;
import com.tribe.backend.entity.Invoice;
import com.tribe.backend.entity.Member;
import com.tribe.backend.entity.enums.ChargeStatus;
import com.tribe.backend.entity.enums.InvoiceStatus;
import com.tribe.backend.exception.ResourceNotFoundException;
import com.tribe.backend.exception.ValidationException;
import com.tribe.backend.repository.ChargeRepository;
import com.tribe.backend.repository.GroupRepository;
import com.tribe.backend.repository.InvoiceRepository;
import com.tribe.backend.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BillingService {

    private final GroupRepository groupRepository;
    private final MemberRepository memberRepository;
    private final InvoiceRepository invoiceRepository;
    private final ChargeRepository chargeRepository;

    public void generateInvoice(UUID groupId) {

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with ID: " + groupId));

        List<Member> members = memberRepository.findByGroupId(groupId);

        if (group.getTotalAmount() == 0) {
            throw new ValidationException("Group total amount is 0");
        }

        if (!group.getStatus().equals("ACTIVE")) {
            throw new ValidationException("Group is not active");
        }

        if (members.isEmpty()) {
            throw new ValidationException("No members found for group");
        }

        Invoice invoice = Invoice.builder()
                .groupId(groupId)
                .totalAmount(group.getTotalAmount())
                .status(InvoiceStatus.PENDING)
                .billingDate(LocalDate.now())
                .createdAt(LocalDateTime.now())
                .build();

        invoice = invoiceRepository.save(invoice);

        int splitAmount = group.getTotalAmount() / members.size();

        for (Member member : members) {
            Charge charge = Charge.builder()
                    .invoiceId(invoice.getId())
                    .memberId(member.getId())
                    .amount(splitAmount)
                    .status(ChargeStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .build();

            chargeRepository.save(charge);
        }
    }

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

    @Transactional
    public void updateInvoiceStatus(UUID invoiceId, InvoiceStatus status) {
        Invoice invoice = getInvoice(invoiceId);
        invoice.setStatus(status);
        invoiceRepository.save(invoice);
    }
}