package com.organicnow.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "room_asset",
        uniqueConstraints = @UniqueConstraint(name = "uk_room_asset_unique", columnNames = {"room_id", "asset_id"})
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RoomAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_asset_id")
    private Long id; // Room_Asset_id

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false, foreignKey = @ForeignKey(name = "fk_room_asset_asset"))
    private Asset asset; // Asset_id -> Asset

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false, foreignKey = @ForeignKey(name = "fk_room_asset_room"))
    private Room room; // Room_id -> Room
}