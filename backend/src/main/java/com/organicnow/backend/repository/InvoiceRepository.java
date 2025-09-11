package com.organicnow.backend.repository;

import com.organicnow.backend.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    // ต้องใช้ contact แทน contract
    List<Invoice> findByContact_Id(Long contractId);
}