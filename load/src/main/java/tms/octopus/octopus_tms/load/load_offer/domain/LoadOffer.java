package tms.octopus.octopus_tms.load.load_offer.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import tms.octopus.octopus_tms.load.load.domain.Load;


@Entity
@Table(name = "LoadOffers")
@Getter
@Setter
public class LoadOffer {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column
    private UUID carrierId;

    @Column(precision = 10, scale = 2)
    private BigDecimal offeredRate;

    @Column(length = 50)
    private String status;

    @Column
    private OffsetDateTime validUntil;

    @Column(length = 100)
    private String equipmentType;

    @Column
    private UUID driverId;

    @Column(columnDefinition = "text")
    private String notes;

    @Column
    private UUID createdBy;

    @Column
    private OffsetDateTime createdAt;

    @Column
    private OffsetDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "load_id", nullable = false)
    private Load load;

}
