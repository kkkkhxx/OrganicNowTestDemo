package com.organicnow.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "contact_type")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ContractType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contact_type_id")
    private Long id;   // Contact_type_id

    @NotBlank
    @Column(name = "contact_name", nullable = false, length = 100)
    private String name;   // Contact_name

    @Min(1)
    @Column(name = "duration")
    private Integer duration;   // Duration (months)
}
