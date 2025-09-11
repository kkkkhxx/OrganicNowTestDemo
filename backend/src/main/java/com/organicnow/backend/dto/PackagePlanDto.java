package com.organicnow.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class PackagePlanDto {
    private Long id;

    private BigDecimal price;

    @JsonProperty("is_active")
    private Integer isActive;

    @JsonProperty("contract_name")
    private String name;

    private Integer duration;
}
