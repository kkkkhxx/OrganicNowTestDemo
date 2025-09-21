package com.organicnow.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MaintainDto {
    private Long id;

    private Integer targetType;        // 0=Asset,1=Room
    private Integer issueCategory;     // 0..5
    private String issueTitle;
    private String issueDescription;

    private LocalDateTime createDate;
    private LocalDateTime scheduledDate;
    private LocalDateTime finishDate;

    // Room/Asset info (flatten)
    private Long roomId;
    private Integer roomFloor;
    private String roomNumber;
    private Long roomAssetId;

    // สถานะ (อนุมานจาก finishDate)
    public String getStatusText() {
        return finishDate == null ? "Open" : "Done";
    }
}
