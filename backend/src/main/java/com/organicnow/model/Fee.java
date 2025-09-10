package com.organicnow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "fee",
        uniqueConstraints = @UniqueConstraint(name = "uk_fee_name", columnNames = "fee_name")
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Fee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fee_id")
    private Long id; // Fee_id

    @NotBlank
    @Size(max = 120)
    @Column(name = "fee_name", nullable = false, length = 120)
    private String feeName; // ชื่อค่าใช้จ่าย เช่น ค่าน้ำ ค่าไฟ ค่าเช่า

    @PositiveOrZero
    @Column(name = "unit_fee", nullable = false)
    private Integer unitFee; // ราคาต่อยูนิต (ถ้าเป็น flat rate ให้เก็บราคาเต็ม)
}