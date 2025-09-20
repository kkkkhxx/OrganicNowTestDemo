package com.organicnow.backend.repository;

import com.organicnow.backend.model.Contract;
import com.organicnow.backend.dto.TenantDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface ContractRepository extends JpaRepository<Contract, Long> {

    @Query("""
        select new com.organicnow.backend.dto.TenantDto(
            c.id,
            t.firstName,
            t.lastName,
            r.roomFloor,
            r.roomNumber,
            r.id,
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

    // ✅ ใช้เช็คว่า tenant นี้มีสัญญาที่ยัง active อยู่หรือไม่
    boolean existsByTenant_IdAndStatusAndEndDateAfter(Long tenantId, Integer status, LocalDateTime now);
}