package com.organicnow.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "contract")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contract_id")
    private Long id;   // Contact_id

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private PackagePlan packagePlan;

    @Column(name = "sign_date")
    private LocalDateTime signDate;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "status", nullable = false)
    private Integer status; // 0=ยังไม่เริ่ม, 1=ใช้งาน, 2=หมดสัญญา, 3=ยกเลิก

    @Min(0)
    @Column(name = "deposit", precision = 12, scale = 2)
    private BigDecimal deposit;

    @Min(0)
    @Column(name = "rent_amount_snapshot", precision = 12, scale = 2)
    private BigDecimal rentAmountSnapshot;
}
