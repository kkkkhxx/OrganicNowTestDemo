package com.organicnow.service;

import com.organicnow.model.ContractType;
import com.organicnow.repository.ContractTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class ContractTypeService {

    private final ContractTypeRepository contractTypeRepository;

    public ContractTypeService(ContractTypeRepository contractTypeRepository) {
        this.contractTypeRepository = contractTypeRepository;
    }

    public List<ContractType> getAllContractTypes() {
        return contractTypeRepository.findAll();
    }

    public ContractType getContractTypeById(Long id) {
        return contractTypeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "ContractType not found with id " + id));
    }

    public ContractType createContractType(ContractType contractType) {
        return contractTypeRepository.save(contractType);
    }

    public void deleteContractType(Long id) {
        if (!contractTypeRepository.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "ContractType not found with id " + id);
        }
        contractTypeRepository.deleteById(id);
    }
}
