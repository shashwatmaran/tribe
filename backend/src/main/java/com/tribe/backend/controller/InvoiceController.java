package com.tribe.backend.controller;

import com.tribe.backend.entity.Charge;
import com.tribe.backend.entity.Invoice;
import com.tribe.backend.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping("/{groupId}/invoices")
    public ResponseEntity<List<Invoice>> getGroupInvoices(
            @PathVariable UUID groupId
    ) {
        List<Invoice> invoices = invoiceService.getGroupInvoices(groupId);
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/{groupId}/invoices/{invoiceId}")
    public ResponseEntity<Invoice> getInvoice(
            @PathVariable UUID groupId,
            @PathVariable UUID invoiceId
    ) {
        Invoice invoice = invoiceService.getInvoice(invoiceId);
        return ResponseEntity.ok(invoice);
    }

    @GetMapping("/{groupId}/invoices/{invoiceId}/charges")
    public ResponseEntity<List<Charge>> getInvoiceCharges(
            @PathVariable UUID groupId,
            @PathVariable UUID invoiceId
    ) {
        List<Charge> charges = invoiceService.getInvoiceCharges(invoiceId);
        return ResponseEntity.ok(charges);
    }
}
