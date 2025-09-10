package com.organicnow.controller;

import com.organicnow.model.ContractType;
import com.organicnow.service.ContractTypeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contract-types")
@CrossOrigin(origins = "http://localhost:5173")
public class ContractTypeController {

    private final ContractTypeService contractTypeService;

    public ContractTypeController(ContractTypeService contractTypeService) {
        this.contractTypeService = contractTypeService;
    }

    @GetMapping
    public ResponseEntity<List<ContractType>> getAllContractTypes() {
        List<ContractType> types = contractTypeService.getAllContractTypes();
        return ResponseEntity.ok(types);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContractType> getContractTypeById(@PathVariable Long id) {
        ContractType type = contractTypeService.getContractTypeById(id);
        return ResponseEntity.ok(type);
    }

    @PostMapping
    public ResponseEntity<ContractType> createContractType(@RequestBody ContractType contractType) {
        ContractType saved = contractTypeService.createContractType(contractType);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContractType(@PathVariable Long id) {
        contractTypeService.deleteContractType(id);
        return ResponseEntity.noContent().build();
    }
}
