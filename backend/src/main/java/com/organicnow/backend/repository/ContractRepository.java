package com.organicnow.backend.repository;

import com.organicnow.backend.model.Contract;
import com.organicnow.backend.dto.TenantDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {

    // ✅ ดึงข้อมูล TenantDto (ที่คุณมีอยู่แล้ว)
    @Query("""
        select new com.organicnow.backend.dto.TenantDto(
            c.id,
            t.firstName,
            t.lastName,
            r.roomFloor,
            r.roomNumber,
            p.id,
            c.startDate,
            c.endDate,
            t.phoneNumber,
            t.email
        )
        from Contract c
        join c.tenant t
        join c.room r
        join c.packagePlan p
        order by c.signDate desc
    """)
    List<TenantDto> findTenantRows();

    // ✅ ใช้สำหรับ Dashboard: เช็กว่าห้องยังมีสัญญาที่ Active อยู่ไหม
    @Query("""
        select case when count(c) > 0 then true else false end
        from Contract c
        where c.room.id = :roomId
          and c.status = 1
          and c.endDate >= CURRENT_TIMESTAMP
    """)
    boolean existsActiveContractByRoomId(Long roomId);
}
