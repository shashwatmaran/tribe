package com.tribe.backend.controller;

import com.tribe.backend.entity.Charge;
import com.tribe.backend.service.ChargeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class ChargeController {

    private final ChargeService chargeService;

    @GetMapping("/{groupId}/charges")
    public ResponseEntity<List<Charge>> getGroupCharges(
            @PathVariable UUID groupId
    ) {
        List<Charge> charges = chargeService.getGroupCharges(groupId);
        return ResponseEntity.ok(charges);
    }
}

@RestController
@RequestMapping("/api/charges")
@RequiredArgsConstructor
class ChargePaymentController {

    private final ChargeService chargeService;

    @PostMapping("/{chargeId}/retry")
    public ResponseEntity<Charge> retryCharge(
            @PathVariable UUID chargeId
    ) {
        Charge charge = chargeService.retryCharge(chargeId);
        return ResponseEntity.ok(charge);
    }

    @GetMapping("/{chargeId}")
    public ResponseEntity<Charge> getCharge(
            @PathVariable UUID chargeId
    ) {
        Charge charge = chargeService.getCharge(chargeId);
        return ResponseEntity.ok(charge);
    }
}
