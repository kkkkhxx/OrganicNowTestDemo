package com.organicnow.controller;

import com.organicnow.dto.CreateTenantContractRequest;
import com.organicnow.dto.TenantDto;
import com.organicnow.dto.UpdateTenantContractRequest;
import com.organicnow.service.TenantService;
import com.organicnow.service.TenantContractService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tenant")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TenantController {

    private final TenantService tenantService;
    private final TenantContractService tenantContractService;

    public TenantController(TenantService tenantService,
                            TenantContractService tenantContractService) {
        this.tenantService = tenantService;
        this.tenantContractService = tenantContractService;
    }

    // List (join contract + tenant + room + package)
    @GetMapping("/list")
    public ResponseEntity<?> list() {
        return ResponseEntity.ok(tenantService.list());
    }

    // Create tenant + contract
    @PostMapping("/create")
    public ResponseEntity<TenantDto> create(@RequestBody CreateTenantContractRequest req) {
        TenantDto dto = tenantContractService.create(req);
        return ResponseEntity.status(201).body(dto);
    }

    // Update by contractId
    @PutMapping("/update/{contractId}")
    public ResponseEntity<TenantDto> update(@PathVariable Long contractId,
                                            @RequestBody UpdateTenantContractRequest req) {
        TenantDto dto = tenantContractService.update(contractId, req);
        return ResponseEntity.ok(dto);
    }

    // Delete contract (soft: ลบเฉพาะ contract)
    @DeleteMapping("/delete/{contractId}")
    public ResponseEntity<Void> delete(@PathVariable Long contractId) {
        tenantContractService.delete(contractId);
        return ResponseEntity.noContent().build();
    }
}