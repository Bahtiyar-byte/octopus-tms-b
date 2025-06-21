package tms.octopus.octopus_tms.broker.contract.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;


@Entity
@Table(name = "Contracts")
@Getter
@Setter
public class Contract {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column
    private UUID brokerId;

    @Column
    private UUID carrierId;

    @Column(length = 50)
    private String contractNumber;

    @Column(length = 50)
    private String status;

    @Column
    private LocalDate effectiveDate;

    @Column
    private LocalDate expirationDate;

    @Column
    private Boolean autoRenew;

    @Column(columnDefinition = "text")
    private String terms;

    @Column(columnDefinition = "text")
    private String rateSchedule;

    @Column(columnDefinition = "text")
    private String insuranceRequirements;

    @Column
    private LocalDate signedDate;

    @Column
    private String signedBy;

    @Column(length = 500)
    private String filePath;

    @Column
    private UUID createdBy;

    @Column
    private OffsetDateTime createdAt;

    @Column
    private OffsetDateTime updatedAt;

}
