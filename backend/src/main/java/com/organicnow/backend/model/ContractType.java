package com.organicnow.backend.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "contract_type")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ContractType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contract_type_id")
    private Long id;

    @NotBlank
    @JsonProperty("contract_name")
    @Column(name = "contract_name", nullable = false, length = 100)
    private String name;

    @Min(1)
    @Column(name = "duration")
    private Integer duration;   // Duration (months)
}
