package com.organicnow.service;

import com.organicnow.dto.TenantDto;
import com.organicnow.repository.ContractRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TenantService {

    private final ContractRepository contractRepository;

    public TenantService(ContractRepository contractRepository) {
        this.contractRepository = contractRepository;
    }

    // ✅ ใช้สำหรับดึง tenant list (join contract + tenant + room + package)
    public Map<String, Object> list() {
        List<TenantDto> rows = contractRepository.findTenantRows();
        Map<String, Object> resp = new HashMap<>();
        resp.put("results", rows);
        resp.put("totalRecords", rows.size());
        return resp;
    }
}