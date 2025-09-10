package com.organicnow.service;

import com.organicnow.dto.PackagePlanDto;
import com.organicnow.dto.PackagePlanRequestDto;
import com.organicnow.model.ContractType;
import com.organicnow.model.PackagePlan;
import com.organicnow.repository.ContractTypeRepository;
import com.organicnow.repository.PackagePlanRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class PackagePlanService {

    private final PackagePlanRepository packagePlanRepository;
    private final ContractTypeRepository contractTypeRepository;

    public PackagePlanService(PackagePlanRepository packagePlanRepository,
                              ContractTypeRepository contractTypeRepository) {
        this.packagePlanRepository = packagePlanRepository;
        this.contractTypeRepository = contractTypeRepository;
    }

    public void createPackage(PackagePlanRequestDto dto) {
        // หา ContractType จาก id ที่ส่งมา
        ContractType contractType = contractTypeRepository.findById(dto.getContractTypeId())
                .orElseThrow(() -> new ResponseStatusException(
                        NOT_FOUND, "ContractType not found with id " + dto.getContractTypeId()
                ));

        // ปิดการใช้งาน PackagePlan เดิมที่ contractType.name ซ้ำ
        List<PackagePlan> existingPackages =
                packagePlanRepository.findByContractType_NameAndIsActive(contractType.getName(), 1);

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
    }

    public List<PackagePlanDto> getAllPackages() {
        return packagePlanRepository.findAll()
                .stream()
                .map(p -> new PackagePlanDto(
                        p.getId(),
                        p.getPrice(),
                        p.getIsActive(),
                        p.getContractType().getName(),
                        p.getContractType().getDuration()
                ))
                .collect(Collectors.toList());
    }
}
