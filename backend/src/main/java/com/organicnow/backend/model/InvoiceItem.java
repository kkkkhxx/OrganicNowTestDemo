package com.organicnow.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;


@Entity
@Table(
        name = "invoice_item",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_invoice_item_invoice_fee",
                columnNames = {"invoice_id", "fee_id"}
        )
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InvoiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_detail_id")
    private Long id; // Invoice_detail_id

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "fee_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_invoice_item_fee"))
    private Fee fee; // Fee_id -> Fee

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_invoice_item_invoice"))
    private Invoice invoice; // Invoice_id -> Invoice

    @PositiveOrZero
    @Column(name = "total_fee", nullable = false)
    private Integer totalFee; // ราคาที่ต้องจ่าย (snapshot)
}