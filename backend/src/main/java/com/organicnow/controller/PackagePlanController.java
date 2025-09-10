package com.organicnow.controller;

import com.organicnow.dto.PackagePlanDto;
import com.organicnow.dto.PackagePlanRequestDto;
import com.organicnow.service.PackagePlanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/packages")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PackagePlanController {

    private final PackagePlanService packagePlanService;

    public PackagePlanController(PackagePlanService packagePlanService) {
        this.packagePlanService = packagePlanService;
    }

    @GetMapping
    public ResponseEntity<List<PackagePlanDto>> getAllPackages() {
        return ResponseEntity.ok(packagePlanService.getAllPackages());
    }

    @PostMapping
    public ResponseEntity<String> createPackage(@RequestBody PackagePlanRequestDto dto) {
        packagePlanService.createPackage(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Package saved successfully");
    }
}
