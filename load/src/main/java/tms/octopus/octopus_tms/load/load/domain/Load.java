package tms.octopus.octopus_tms.load.load.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import tms.octopus.octopus_tms.base.load.model.EquipmentType;
import tms.octopus.octopus_tms.base.load.model.LoadStatus;
import tms.octopus.octopus_tms.base.load.model.RoutingType;
import tms.octopus.octopus_tms.load.load_cargo.domain.LoadCargo;
import tms.octopus.octopus_tms.load.load_document.domain.LoadDocument;
import tms.octopus.octopus_tms.load.load_offer.domain.LoadOffer;
import tms.octopus.octopus_tms.load.load_stop.domain.LoadStop;


@Entity
@Table(name = "Loads")
@Getter
@Setter
public class Load {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false, length = 50)
    private String loadNumber;

    @Column
    private UUID brokerId;

    @Column
    private UUID shipperId;

    @Column
    private UUID carrierId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private LoadStatus status;

    @Column(length = 500)
    private String originAddress;

    @Column(length = 100)
    private String originCity;

    @Column(length = 50)
    private String originState;

    @Column(length = 20)
    private String originZip;

    @Column(precision = 10, scale = 6)
    private BigDecimal originLat;

    @Column(precision = 10, scale = 6)
    private BigDecimal originLng;

    @Column(length = 500)
    private String destinationAddress;

    @Column(length = 100)
    private String destinationCity;

    @Column(length = 50)
    private String destinationState;

    @Column(length = 20)
    private String destinationZip;

    @Column(precision = 10, scale = 6)
    private BigDecimal destinationLat;

    @Column(precision = 10, scale = 6)
    private BigDecimal destinationLng;

    @Column
    private Integer distance;

    @Column
    private String commodity;

    @Column
    private Integer weight;

    @Column
    @Enumerated(EnumType.STRING)
    private EquipmentType equipmentType;

    @Column
    @Enumerated(EnumType.STRING)
    private RoutingType routingType;

    @Column(precision = 10, scale = 2)
    private BigDecimal rate;

    @Column(precision = 10, scale = 2)
    private BigDecimal carrierRate;

    @Column
    private LocalDate pickupDate;

    @Column
    private LocalTime pickupTimeStart;

    @Column
    private LocalTime pickupTimeEnd;

    @Column
    private LocalDate deliveryDate;

    @Column
    private LocalTime deliveryTimeStart;

    @Column
    private LocalTime deliveryTimeEnd;

    @Column(columnDefinition = "text")
    private String notes;

    @Column(columnDefinition = "text")
    private String specialInstructions;

    @Column(length = 100)
    private String referenceNumber;

    @Column
    private Boolean postedToLoadboards;

    @Column
    private UUID createdBy;

    @Column
    private UUID assignedDispatcher;

    @Column
    private UUID assignedDriverId;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "load")
    private Set<LoadCargo> cargoes;

    @OneToMany(mappedBy = "load")
    private Set<LoadStop> loadStops;

    @OneToMany(mappedBy = "load")
    private Set<LoadDocument> documents;

    @OneToMany(mappedBy = "load")
    private Set<LoadOffer> offers;

    @PrePersist
    public void prePersist() {
        final OffsetDateTime now = OffsetDateTime.now();
        if (this.createdAt == null) {
            this.createdAt = now;
        }
        this.updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

}
