package com.organicnow.backend.service;

import com.organicnow.backend.model.ContractType;
import com.organicnow.backend.repository.ContractTypeRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ContactTypeService {

    private final ContractTypeRepository contractTypeRepository;

    public ContactTypeService(ContractTypeRepository contractTypeRepository) {
        this.contractTypeRepository = contractTypeRepository;
    }

    public Map<String, Object> getAllContactTypes() {
        List<ContractType> types = contractTypeRepository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("result", types);
        return response;
    }

    public Map<String, Object> getContactTypeById(Long id) {
        ContractType type = contractTypeRepository.findById(id)
                .orElse(null);
        Map<String, Object> response = new HashMap<>();
        response.put("result", type);
        return response;
    }

    public Map<String, Object> createContactType(ContractType contractType) {
        ContractType saved = contractTypeRepository.save(contractType);
        Map<String, Object> response = new HashMap<>();
        response.put("result", saved);
        return response;
    }

    public Map<String, Object> deleteContactType(Long id) {
        contractTypeRepository.deleteById(id);
        Map<String, Object> response = new HashMap<>();
        response.put("result", "ContractType with ID " + id + " deleted successfully");
        return response;
    }
}