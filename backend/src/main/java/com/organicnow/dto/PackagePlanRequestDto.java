package com.organicnow.backend.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class PackagePlanRequestDto {
    private BigDecimal price;
    private Integer isActive;
    private Long contract_type_id;  // 👈 รับเป็น id ตรง ๆ
}
