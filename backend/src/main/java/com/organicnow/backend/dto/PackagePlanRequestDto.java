package com.organicnow.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PackagePlanRequestDto {
    private BigDecimal price;

    @JsonProperty("is_active")
    private Integer isActive;

    @JsonProperty("contract_type_id")
    private Long contractTypeId;  // 👈 ใช้ camelCase ใน Java
}
