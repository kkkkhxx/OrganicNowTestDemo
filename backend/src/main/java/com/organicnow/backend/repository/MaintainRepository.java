package com.organicnow.backend.repository;

import com.organicnow.backend.model.Maintain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintainRepository extends JpaRepository<Maintain, Long> {

    // ✅ ใช้สำหรับ Dashboard: เช็กว่าห้องยังมีงานซ่อมที่ยังไม่เสร็จ
    @Query("""
        select case when count(m) > 0 then true else false end
        from Maintain m
        where m.room.id = :roomId
          and m.finishDate >= CURRENT_TIMESTAMP
    """)
    boolean existsActiveMaintainByRoomId(Long roomId);

    // ✅ Dashboard: นับจำนวน maintain ต่อเดือน (12 เดือนล่าสุด) → ใช้ Native SQL
    @Query(value = """
        SELECT to_char(m.create_date, 'YYYY-MM') AS month,
               COUNT(m.maintain_id) AS total
        FROM maintain m
        WHERE m.create_date >= date_trunc('month', CURRENT_DATE) - INTERVAL '11 months'
        GROUP BY to_char(m.create_date, 'YYYY-MM')
        ORDER BY month
    """, nativeQuery = true)
    List<Object[]> countRequestsLast12Months();
}
