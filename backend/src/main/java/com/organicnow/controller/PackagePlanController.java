package com.organicnow.backend.controller;

import com.organicnow.backend.model.PackagePlan;
import com.organicnow.backend.service.PackagePlanService;
import org.springframework.web.bind.annotation.*;
import com.organicnow.backend.dto.PackagePlanRequestDto;

import java.util.Map;

@RestController
@RequestMapping("/packages")
@CrossOrigin(origins = "http://localhost:5173")
public class PackagePlanController {

    private final PackagePlanService packagePlanService;

    public PackagePlanController(PackagePlanService packagePlanService) {
        this.packagePlanService = packagePlanService;
    }

    @GetMapping
    public Map<String, Object> getAllPackages() {
        return packagePlanService.getAllPackages();
    }

    @PostMapping
    public Map<String, Object> createPackage(@RequestBody PackagePlanRequestDto dto) {
        return packagePlanService.createPackage(dto);
    }
}
