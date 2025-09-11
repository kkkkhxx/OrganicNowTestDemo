package com.organicnow.backend.repository;

import com.organicnow.backend.model.ContractType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContractTypeRepository extends JpaRepository<ContractType, Long> {
    Optional<ContractType> findByName(String name);
}
