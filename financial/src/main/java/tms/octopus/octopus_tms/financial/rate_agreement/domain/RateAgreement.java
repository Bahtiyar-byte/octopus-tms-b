package tms.octopus.octopus_tms.financial.rate_agreement.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import tms.octopus.octopus_tms.base.load.model.EquipmentType;


@Entity
@Table(name = "RateAgreements")
@Getter
@Setter
public class RateAgreement {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false, length = 50)
    private String agreementNumber;

    @Column(length = 100)
    private String laneOriginCity;

    @Column(length = 50)
    private String laneOriginState;

    @Column(length = 20)
    private String laneOriginZip;

    @Column(length = 100)
    private String laneDestinationCity;

    @Column(length = 50)
    private String laneDestinationState;

    @Column(length = 20)
    private String laneDestinationZip;

    @Column
    @Enumerated(EnumType.STRING)
    private EquipmentType equipmentType;

    @Column(precision = 10, scale = 2)
    private BigDecimal baseRate;

    @Column(precision = 5, scale = 2)
    private BigDecimal ratePerMile;

    @Column(precision = 5, scale = 2)
    private BigDecimal fuelSurchargePercent;

    @Column(precision = 10, scale = 2)
    private BigDecimal minRate;

    @Column(columnDefinition = "text")
    private String accessorialRates;

    @Column(nullable = false)
    private LocalDate validFrom;

    @Column(nullable = false)
    private LocalDate validUntil;

    @Column
    private Boolean autoRenew;

    @Column(length = 50)
    private String status;

    @Column(columnDefinition = "text")
    private String notes;

    @Column
    private OffsetDateTime createdAt;

    @Column
    private OffsetDateTime updatedAt;

}
