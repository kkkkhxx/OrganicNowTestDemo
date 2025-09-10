package com.organicnow.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TenantDto {
    private Long contractId;

    private String firstName;
    private String lastName;

    private Integer floor;
    private String room;

    private Long packageId;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private String phoneNumber;
}