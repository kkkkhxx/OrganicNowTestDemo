package com.organicnow.backend.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TenantDto {

    private Long contractId;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String room;
    private Integer floor;
    private Long roomId;

    // ✅ เอา packageId กลับมา
    private Long packageId;

    // ✅ ใช้ LocalDateTime ให้ตรงกับ Contract entity
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime signDate;

    private BigDecimal deposit;
    private BigDecimal rentAmountSnapshot;

    // 🔧 Custom constructor ให้ match กับ query ใน ContractRepository
    public TenantDto(
            Long contractId,
            String firstName,
            String lastName,
            Integer floor,
            String room,
            Long roomId,
            Long packageId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String phoneNumber,
            String email
    ) {
        this.contractId = contractId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.floor = floor;
        this.room = room;
        this.roomId = roomId;
        this.packageId = packageId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }
}