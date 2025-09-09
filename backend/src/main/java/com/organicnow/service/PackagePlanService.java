package com.organicnow.backend.service;

import com.organicnow.backend.dto.PackagePlanDto;
import com.organicnow.backend.model.ContractType;
import com.organicnow.backend.model.PackagePlan;
import com.organicnow.backend.repository.ContractTypeRepository;
import com.organicnow.backend.repository.PackagePlanRepository;
import com.organicnow.backend.dto.PackagePlanRequestDto;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PackagePlanService {

    private final PackagePlanRepository packagePlanRepository;
    private final ContractTypeRepository contractTypeRepository;

    public PackagePlanService(PackagePlanRepository packagePlanRepository, ContractTypeRepository contractTypeRepository) {
        this.packagePlanRepository = packagePlanRepository;
        this.contractTypeRepository = contractTypeRepository;
    }

    public Map<String, Object> createPackage(PackagePlanRequestDto dto) {
        // หา ContractType จาก id ที่ส่งมา
        ContractType contractType = contractTypeRepository.findById(dto.getContract_type_id())
                .orElseThrow(() -> new RuntimeException("ContractType not found"));

        // ปิดการใช้งาน PackagePlan เดิมที่ contractType.name ซ้ำ
        List<PackagePlan> existingPackages = packagePlanRepository.findByContractType_NameAndIsActive(contractType.getName(), 1);
        for (PackagePlan oldPlan : existingPackages) {
            oldPlan.setIsActive(0);
            packagePlanRepository.save(oldPlan);
        }

        // สร้าง PackagePlan ใหม่
        PackagePlan packagePlan = PackagePlan.builder()
                .price(dto.getPrice())
                .isActive(dto.getIsActive())
                .contractType(contractType)
                .build();

        packagePlanRepository.save(packagePlan);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Package saved successfully");
        return response;
    }


    public Map<String, Object> getAllPackages() {
        List<PackagePlanDto> dtos = packagePlanRepository.findAll()
                .stream()
                .map(p -> new PackagePlanDto(
                        p.getId(),
                        p.getPrice(),
                        p.getIsActive(),
                        p.getContractType().getName(),
                        p.getContractType().getDuration()
                ))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("result", dtos);
        return response;
    }
}
