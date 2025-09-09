package com.organicnow.backend.repository;

import com.organicnow.backend.dto.TenantDto;
import com.organicnow.backend.model.Contract;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {

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
               t.phoneNumber
           )
           from Contract c
           join c.tenant t
           join c.room r
           join c.packagePlan p
           order by t.firstName asc, t.lastName asc
           """)
    List<TenantDto> findTenantRows();
}