package com.organicnow.backend.service;

import com.organicnow.backend.dto.CreateTenantContractRequest;
import com.organicnow.backend.dto.TenantDto;
import com.organicnow.backend.dto.TenantDetailDto;
import com.organicnow.backend.dto.UpdateTenantContractRequest;
import com.organicnow.backend.model.*;
import com.organicnow.backend.repository.*;
import com.organicnow.backend.model.*;
import com.organicnow.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TenantContractService {

    private final TenantRepository tenantRepository;
    private final RoomRepository roomRepository;
    private final PackagePlanRepository packagePlanRepository;
    private final ContractRepository contractRepository;
    private final InvoiceRepository invoiceRepository;

    public TenantContractService(TenantRepository tenantRepository,
                                 RoomRepository roomRepository,
                                 PackagePlanRepository packagePlanRepository,
                                 ContractRepository contractRepository,
                                 InvoiceRepository invoiceRepository) {
        this.tenantRepository = tenantRepository;
        this.roomRepository = roomRepository;
        this.packagePlanRepository = packagePlanRepository;
        this.contractRepository = contractRepository;
        this.invoiceRepository = invoiceRepository;
    }

    // ➕ CREATE
    @Transactional
    public TenantDto create(CreateTenantContractRequest req) {
        Tenant tenant = Tenant.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .phoneNumber(req.getPhoneNumber())
                .nationalId(req.getNationalId())
                .build();
        tenant = tenantRepository.save(tenant);

        Room room = roomRepository.findById(req.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found: " + req.getRoomId()));
        PackagePlan plan = packagePlanRepository.findById(req.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package plan not found: " + req.getPackageId()));

        Contract contract = Contract.builder()
                .tenant(tenant)
                .room(room)
                .packagePlan(plan)
                .signDate(LocalDateTime.now())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .status(1) // 1 = Active
                .deposit(req.getDeposit())
                .rentAmountSnapshot(req.getRentAmountSnapshot())
                .build();
        contractRepository.save(contract);

        return TenantDto.builder()
                .contractId(contract.getId())
                .firstName(tenant.getFirstName())
                .lastName(tenant.getLastName())
                .floor(room.getRoomFloor())
                .room(room.getRoomNumber())
                .packageId(plan.getId())
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .phoneNumber(tenant.getPhoneNumber())
                .build();
    }

    // ✏️ UPDATE
    @Transactional
    public TenantDto update(Long contractId, UpdateTenantContractRequest req) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found: " + contractId));

        Tenant tenant = contract.getTenant();
        if (req.getFirstName() != null) tenant.setFirstName(req.getFirstName());
        if (req.getLastName() != null) tenant.setLastName(req.getLastName());
        if (req.getEmail() != null) tenant.setEmail(req.getEmail());
        if (req.getPhoneNumber() != null) tenant.setPhoneNumber(req.getPhoneNumber());
        if (req.getNationalId() != null) tenant.setNationalId(req.getNationalId());
        tenantRepository.save(tenant);

        if (req.getRoomId() != null) {
            Room room = roomRepository.findById(req.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Room not found: " + req.getRoomId()));
            contract.setRoom(room);
        }
        if (req.getPackageId() != null) {
            PackagePlan plan = packagePlanRepository.findById(req.getPackageId())
                    .orElseThrow(() -> new RuntimeException("Package plan not found: " + req.getPackageId()));
            contract.setPackagePlan(plan);
        }

        if (req.getStartDate() != null) contract.setStartDate(req.getStartDate());
        if (req.getEndDate() != null) contract.setEndDate(req.getEndDate());
        if (req.getStatus() != null) contract.setStatus(req.getStatus());
        if (req.getDeposit() != null) contract.setDeposit(req.getDeposit());
        if (req.getRentAmountSnapshot() != null) contract.setRentAmountSnapshot(req.getRentAmountSnapshot());

        Contract saved = contractRepository.save(contract);

        return TenantDto.builder()
                .contractId(saved.getId())
                .firstName(saved.getTenant().getFirstName())
                .lastName(saved.getTenant().getLastName())
                .floor(saved.getRoom().getRoomFloor())
                .room(saved.getRoom().getRoomNumber())
                .packageId(saved.getPackagePlan().getId())
                .startDate(saved.getStartDate())
                .endDate(saved.getEndDate())
                .phoneNumber(saved.getTenant().getPhoneNumber())
                .build();
    }

    // ❌ DELETE
    @Transactional
    public void delete(Long contractId) {
        if (!contractRepository.existsById(contractId)) {
            throw new RuntimeException("Contract not found: " + contractId);
        }
        contractRepository.deleteById(contractId);
    }

    // 🔍 DETAIL
    @Transactional(readOnly = true)
    public TenantDetailDto getDetail(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found: " + contractId));

        Tenant tenant = contract.getTenant();
        Room room = contract.getRoom();
        PackagePlan plan = contract.getPackagePlan();

        List<Invoice> invoices = invoiceRepository.findByContact_Id(contractId);

        List<TenantDetailDto.InvoiceDto> invoiceDtos = invoices.stream()
                .map(inv -> TenantDetailDto.InvoiceDto.builder()
                        .invoiceId(inv.getId())
                        .createDate(inv.getCreateDate())
                        .dueDate(inv.getDueDate())
                        .invoiceStatus(inv.getInvoiceStatus())
                        .netAmount(inv.getNetAmount())
                        .payDate(inv.getPayDate())
                        .payMethod(inv.getPayMethod())
                        .penaltyTotal(inv.getPenaltyTotal())
                        .subTotal(inv.getSubTotal())
                        .build()
                ).toList();

        return TenantDetailDto.builder()
                .contractId(contract.getId())
                .firstName(tenant.getFirstName())
                .lastName(tenant.getLastName())
                .email(tenant.getEmail())
                .phoneNumber(tenant.getPhoneNumber())
                .nationalId(tenant.getNationalId())
                .floor(room.getRoomFloor())
                .room(room.getRoomNumber())
                .packageName(plan.getContractType().getName())
                .packagePrice(plan.getPrice())
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .status(contract.getStatus())
                .deposit(contract.getDeposit())
                .rentAmountSnapshot(contract.getRentAmountSnapshot())
                .invoices(invoiceDtos)
                .build();
    }
}