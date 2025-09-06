package com.organicnow.backend.service;

import com.organicnow.backend.dto.PackagePlanDto;
import com.organicnow.backend.model.ContractType;
import com.organicnow.backend.model.PackagePlan;
import com.organicnow.backend.repository.ContractTypeRepository;
import com.organicnow.backend.repository.PackagePlanRepository;
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

    public Map<String, Object> createPackage(PackagePlan packagePlan) {
        // หา ContractType ที่มีอยู่แล้ว
        ContractType contractType = contractTypeRepository.findById(packagePlan.getContractType().getId())
                .orElseThrow(() -> new RuntimeException("ContractType not found"));

        // ปิดการใช้งาน PackagePlan เดิมที่มี contractType.name ซ้ำ
        List<PackagePlan> existingPackages = packagePlanRepository.findByContractType_NameAndIsActive(contractType.getName(), 1);
        for (PackagePlan oldPlan : existingPackages) {
            oldPlan.setIsActive(0);
            packagePlanRepository.save(oldPlan);
        }

        // สร้าง PackagePlan ใหม่
        packagePlan.setIsActive(1);
        PackagePlan saved = packagePlanRepository.save(packagePlan);

        // map Entity → DTO
        PackagePlanDto dto = new PackagePlanDto(
                saved.getId(),
                saved.getPrice(),
                saved.getIsActive(),
                saved.getContractType().getName(),
                saved.getContractType().getDuration()
        );

        // คืนค่า { result: {} }
        Map<String, Object> response = new HashMap<>();
        response.put("result", dto);
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
