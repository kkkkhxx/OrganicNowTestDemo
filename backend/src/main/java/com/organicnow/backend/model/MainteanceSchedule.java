package com.organicnow.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "maintenance_schedule",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_schedule_scope_room_asset_title",
                columnNames = {"schedule_scope", "room_id", "room_asset_id", "schedule_title"}
        )
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MaintenanceSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long id; // schedule_id

    /** 0 = ตรวจของในห้อง | 1 = ตรวจห้อง */
    @Min(0) @Max(1)
    @Column(name = "schedule_scope", nullable = false)
    private Integer scheduleScope; // schedule_scope

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false, foreignKey = @ForeignKey(name = "fk_schedule_room"))
    private Room room; // room_id -> Room

    // ว่างได้ถ้า scope = ตรวจห้อง
    @ManyToOne(optional = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "room_asset_id", foreignKey = @ForeignKey(name = "fk_schedule_room_asset"))
    private RoomAsset roomAsset; // room_asset_id -> RoomAsset

    @Positive
    @Column(name = "cycle_month", nullable = false)
    private Integer cycleMonth; // ตรวจทุกกี่เดือน

    @Column(name = "last_done_date")
    private LocalDateTime lastDoneDate; // เวลาล่าสุดที่ตรวจ

    @Column(name = "next_due_date")
    private LocalDateTime nextDueDate; // วันครบกำหนดรอบถัดไป

    @PositiveOrZero
    @Column(name = "notify_before_date", nullable = false)
    private Integer notifyBeforeDate; // แจ้งล่วงหน้ากี่วัน

    @NotBlank
    @Size(max = 200)
    @Column(name = "schedule_title", nullable = false, length = 200)
    private String scheduleTitle; // หัวข้อ

    @Size(max = 1000)
    @Column(name = "schedule_description", length = 1000)
    private String scheduleDescription; // รายละเอียด
}