package com.organicnow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data                  // สร้าง getter/setter, toString, equals, hashCode ให้อัตโนมัติ
@AllArgsConstructor   // สร้าง constructor ที่รับทุก field ให้อัตโนมัติ
public class PackagePlanDto {
    private Long id;
    private BigDecimal price;
    private Integer isActive;
    private String name;
    private Integer duration;
}
