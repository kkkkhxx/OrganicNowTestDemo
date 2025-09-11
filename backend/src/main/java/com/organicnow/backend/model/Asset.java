package com.organicnow.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(
        name = "asset",
        uniqueConstraints = @UniqueConstraint(name = "uk_asset_group_asset_name", columnNames = {"asset_group_id", "asset_name"})
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "asset_id")
    private Long id; // Asset_id

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_group_id", nullable = false, foreignKey = @ForeignKey(name = "fk_asset_asset_group"))
    private AssetGroup assetGroup; // AssetGroup_id -> AssetGroup

    @NotBlank
    @Size(max = 120)
    @Column(name = "asset_name", nullable = false, length = 120)
    private String assetName; // ชื่อของ เช่น "ตู้เย็น LG"
}
