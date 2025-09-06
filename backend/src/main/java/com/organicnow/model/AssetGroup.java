package com.organicnow.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "asset_group",
        uniqueConstraints = @UniqueConstraint(name = "uk_asset_group_name", columnNames = "asset_group_name")
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AssetGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "asset_group_id")
    private Long id; // AssetGroup_id

    @NotBlank
    @Size(max = 100)
    @Column(name = "asset_group_name", nullable = false, length = 100)
    private String assetGroupName; // AssetGroup_Name
}