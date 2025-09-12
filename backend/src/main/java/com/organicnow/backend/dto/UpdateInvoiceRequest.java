package com.organicnow.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateInvoiceRequest {

    private LocalDateTime dueDate; // วันครบกำหนดชำระ
    private Integer invoiceStatus; // 0=ยังไม่ชำระ, 1=ชำระแล้ว, 2=ยกเลิก
    private LocalDateTime payDate; // วันที่ชำระจริง
    private Integer payMethod; // วิธีชำระ
    private Integer subTotal; // ยอดปกติ
    private Integer penaltyTotal; // ยอดปรับ
    private Integer netAmount; // ยอดสุทธิ
    private LocalDateTime penaltyAppliedAt; // วันที่เพิ่ม penalty
    private String notes; // หมายเหตุเพิ่มเติม
}
