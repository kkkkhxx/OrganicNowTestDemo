package com.organicnow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "tenant",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_tenant_national_id", columnNames = "national_id"),
                @UniqueConstraint(name = "uk_tenant_email", columnNames = "email")
        }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tenant_id")
    private Long id;   // Tenant_id

    @NotBlank
    @Column(name = "first_name", length = 100)
    private String firstName;

    @NotBlank
    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "phone_number", length = 50)
    private String phoneNumber;

    @Email
    @Column(name = "email", length = 255)
    private String email;

    @NotBlank
    @Column(name = "national_id", length = 50)
    private String nationalId;

}
