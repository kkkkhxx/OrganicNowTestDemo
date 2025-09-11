package com.organicnow.backend.repository;

import com.organicnow.backend.model.PackagePlan;
import com.organicnow.backend.model.ContractType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PackagePlanRepository extends JpaRepository<PackagePlan, Long> {
    List<PackagePlan> findByContractType_NameAndIsActive(String name, Integer isActive);
}
